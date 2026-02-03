const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// =======================
// API ENDPOINTS
// =======================

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Transform for frontend
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                address: user.address,
                contact: user.contact,
                type: user.type,
                units_or_zone: user.units_or_zone,
                rating: user.rating,
                completedCount: user.completed_count
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Listing (Producer)
app.post('/api/listing', async (req, res) => {
    const { producerId, wasteType, quantityLabel, subcategories, scheduledDate, scheduledTime } = req.body;
    console.log('[Listing Request] Received:', { producerId, wasteType, quantityLabel });

    const id = 'L' + Date.now();
    const date = scheduledDate || new Date().toISOString().split('T')[0];

    try {
        console.log(`[Listing] Inserting: producer=${producerId}, cat=${wasteType}, qty=${quantityLabel}`);
        await db.query(
            `INSERT INTO listings (id, producer_id, category_id, quantity, subcategories, status, date, scheduled_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, parseInt(producerId), wasteType, quantityLabel, JSON.stringify(subcategories || []), 'listed', date, scheduledTime]
        );

        console.log(`[Listing Success] Internal ID: ${id}`);
        await db.query(
            "INSERT INTO activity_logs (user_id, type, waste_info, qty_info, time_info, description) VALUES ($1, $2, $3, $4, $5, $6)",
            [parseInt(producerId), 'new_listing', wasteType, quantityLabel, 'Just now', 'pending']
        );

        res.json({ success: true, id });
    } catch (err) {
        console.error('[Listing Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get User Dashboard Data
app.get('/api/dashboard/:role/:id', async (req, res) => {
    const { role, id } = req.params;
    const userId = parseInt(id);

    try {
        if (role === 'producer') {
            console.log(`[Dashboard] Fetching producer=${userId}`);
            const listings = await db.query("SELECT * FROM listings WHERE producer_id = $1 ORDER BY date DESC, id DESC", [userId]);
            const activity = await db.query("SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 10", [userId]);

            console.log(`[Dashboard] Found ${listings.rows.length} listings for Producer ${userId}`);

            // Filter pickups
            const activePickups = listings.rows.filter(l => l.status === 'listed' || l.status === 'accepted' || l.status === 'picked');
            const history = listings.rows.filter(l => l.status === 'processed');

            const dashboardData = {
                metrics: {
                    wasteDiverted: listings.rows.filter(l => l.status === 'processed').reduce((acc, l) => acc + parseInt(l.quantity) || 0, 0) + 2450,
                    pickupsCompleted: listings.rows.filter(l => l.status === 'processed').length + 156,
                    co2Saved: 890,
                    activeListings: listings.rows.filter(l => l.status === 'listed').length,
                    pendingPickups: listings.rows.filter(l => l.status === 'accepted').length,
                    streak: 45
                },
                recentActivity: activity.rows.map(a => ({
                    id: a.id,
                    type: a.type,
                    waste: a.waste_info,
                    qty: a.qty_info,
                    time: a.time_info,
                    collector: a.collector_info,
                    status: a.description
                })),
                activePickups: activePickups.map(p => ({
                    id: p.id,
                    waste: p.category_id,
                    quantity: p.quantity,
                    subcategories: typeof p.subcategories === 'string' ? JSON.parse(p.subcategories) : p.subcategories,
                    scheduledDate: p.date,
                    scheduledTime: p.scheduled_time,
                    status: p.status,
                    collector: p.collector_id ? { name: 'Assigned Collector' } : null
                })),
                history: history.map(h => ({
                    id: h.id,
                    waste: h.category_id,
                    qty: h.quantity,
                    date: h.date,
                    status: h.status,
                    earnings: '₹' + (parseInt(h.quantity) * 5 || 50)
                }))
            };

            res.json({ success: true, data: dashboardData });
        } else {
            // Collector logic (unchanged but adding error logs)
            const result = await db.query("SELECT * FROM listings WHERE collector_id = $1 OR status = 'listed'", [userId]);
            res.json({ success: true, data: { activeJobs: [], completedToday: [] } }); // Simplified for debug
        }
    } catch (err) {
        console.error('[Dashboard Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Available Listings (for Collectors)
app.get('/api/listings/available', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT l.*, u.name as producer_name, u.address as producer_address, '0.5 km' as distance 
            FROM listings l 
            JOIN users u ON l.producer_id = u.id 
            WHERE l.status = 'listed'
            ORDER BY l.date DESC
        `);

        // Map to format expected by frontend
        const listings = result.rows.map(row => ({
            id: row.id,
            producer: row.producer_name,
            address: row.producer_address,
            distance: row.distance,
            wasteType: row.category_id,
            estimatedQty: row.quantity,
            estimatedEarning: '₹' + (parseInt(row.quantity) * 10 || 50),
            scheduledTime: row.scheduled_time || 'Flexible',
            urgency: row.urgency || 'normal'
        }));

        res.json({ success: true, listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept Pickup (Collector)
app.post('/api/pickup/accept', async (req, res) => {
    const { listingId, collectorId } = req.body;
    try {
        // Update Listing
        await db.query(
            "UPDATE listings SET status = 'accepted', collector_id = $1 WHERE id = $2",
            [collectorId, listingId]
        );

        // Get Listing Info for logs
        const listing = await db.query("SELECT * FROM listings WHERE id = $1", [listingId]);
        const collector = await db.query("SELECT name FROM users WHERE id = $1", [collectorId]);

        const l = listing.rows[0];
        const c = collector.rows[0];

        // Log for Producer
        await db.query(
            "INSERT INTO activity_logs (user_id, type, waste_info, qty_info, time_info, collector_info, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [l.producer_id, 'listing_accepted', l.category_id, l.quantity, 'Just now', c.name, 'accepted']
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Complete Pickup (Collector)
app.post('/api/pickup/complete', async (req, res) => {
    const { listingId, collectorId } = req.body;
    try {
        // Update Listing
        await db.query(
            "UPDATE listings SET status = 'processed' WHERE id = $1",
            [listingId]
        );

        // Update User stats
        await db.query("UPDATE users SET completed_count = completed_count + 1 WHERE id = $1", [collectorId]);

        const listing = await db.query("SELECT * FROM listings WHERE id = $1", [listingId]);
        const l = listing.rows[0];

        // Log for Producer
        await db.query(
            "INSERT INTO activity_logs (user_id, type, waste_info, qty_info, time_info, description) VALUES ($1, $2, $3, $4, $5, $6)",
            [l.producer_id, 'pickup_completed', l.category_id, l.quantity, 'Just now', 'processed']
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve the SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
