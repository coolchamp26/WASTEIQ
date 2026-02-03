require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const initDb = async () => {
    try {
        // Users Table
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE,
            password TEXT, 
            role TEXT,
            name TEXT,
            address TEXT,
            contact TEXT,
            type TEXT,
            units_or_zone TEXT,
            rating DECIMAL DEFAULT 0,
            completed_count INTEGER DEFAULT 0
        )`);

        // Waste Categories Table
        await pool.query(`CREATE TABLE IF NOT EXISTS waste_categories (
            id TEXT PRIMARY KEY,
            name TEXT,
            icon TEXT,
            color TEXT,
            subcategories JSONB,
            recovery_path TEXT,
            price_range TEXT
        )`);

        // Listings Table
        await pool.query(`CREATE TABLE IF NOT EXISTS listings (
            id TEXT PRIMARY KEY,
            producer_id INTEGER REFERENCES users(id),
            category_id TEXT REFERENCES waste_categories(id),
            subcategories JSONB,
            quantity TEXT,
            status TEXT,
            date TEXT,
            distance TEXT,
            scheduled_time TEXT,
            urgency TEXT,
            collector_id INTEGER REFERENCES users(id)
        )`);

        // Activity Logs Table
        await pool.query(`CREATE TABLE IF NOT EXISTS activity_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            type TEXT,
            description TEXT,
            waste_info TEXT,
            qty_info TEXT,
            time_info TEXT,
            collector_info TEXT,
            timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Categories
        const catCheck = await pool.query("SELECT count(*) FROM waste_categories");
        if (parseInt(catCheck.rows[0].count) === 0) {
            console.log('Seeding waste categories...');
            const categories = [
                { id: 'dry', name: 'Dry Waste', icon: '📦', color: '#f59e0b', subcategories: ['Paper', 'Cardboard', 'Plastic Bottles', 'Metal Cans', 'Glass'], recoveryPath: 'recycle', priceRange: '₹5 - ₹15 per kg' },
                { id: 'wet', name: 'Wet Waste', icon: '🥬', color: '#22c55e', subcategories: ['Food Scraps', 'Garden Waste', 'Organic Matter'], recoveryPath: 'compost', priceRange: '₹2 - ₹5 per kg' },
                { id: 'ewaste', name: 'E-Waste', icon: '💻', color: '#8b5cf6', subcategories: ['Computers', 'Phones', 'Cables', 'Batteries', 'Appliances'], recoveryPath: 'specialized', priceRange: '₹20 - ₹100 per kg' },
                { id: 'debris', name: 'Debris', icon: '🧱', color: '#64748b', subcategories: ['Construction Waste', 'Tiles', 'Concrete', 'Wood'], recoveryPath: 'landfill', priceRange: 'Charges apply' }
            ];
            for (const c of categories) {
                await pool.query(
                    "INSERT INTO waste_categories (id, name, icon, color, subcategories, recovery_path, price_range) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [c.id, c.name, c.icon, c.color, JSON.stringify(c.subcategories), c.recoveryPath, c.priceRange]
                );
            }
        }

        // Seed Users
        const userCheck = await pool.query("SELECT count(*) FROM users");
        if (parseInt(userCheck.rows[0].count) === 0) {
            console.log('Seeding initial users...');
            const users = [
                { email: 'producer@wasteiq.com', password: '123', role: 'producer', name: 'Green Valley Apartments', address: 'Block A, Sector 15, Gurugram', contact: '+91 98765 43210', type: 'Residential Society', units_or_zone: '120 units' },
                { email: 'collector@wasteiq.com', password: '123', role: 'collector', name: 'Ramesh Kumar', address: 'Sector 14, Gurugram', contact: '+91 98765 12345', type: 'Independent Collector', units_or_zone: 'Sector 14-18', rating: 4.8, completed_count: 342 },
                { email: 'admin@wasteiq.com', password: '123', role: 'admin', name: 'System Admin', address: 'HQ Office', contact: 'admin@wasteiq.com', type: 'Administrator' }
            ];
            for (const u of users) {
                await pool.query(
                    "INSERT INTO users (email, password, role, name, address, contact, type, units_or_zone, rating, completed_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                    [u.email, u.password, u.role, u.name, u.address, u.contact, u.type, u.units_or_zone, u.rating || 0, u.completed_count || 0]
                );
            }
        }

        // Seed Listings & Activity if empty
        const listingCheck = await pool.query("SELECT count(*) FROM listings");
        if (parseInt(listingCheck.rows[0].count) === 0) {
            console.log('Seeding initial listings and activity...');
            const producer = await pool.query("SELECT id FROM users WHERE role = 'producer' LIMIT 1");
            const collector = await pool.query("SELECT id FROM users WHERE role = 'collector' LIMIT 1");
            const pid = producer.rows[0].id;
            const cid = collector.rows[0].id;

            // Historical Listings (Completed)
            const history = [
                { id: 'PU000', waste: 'Mixed', qty: '45 kg', date: '2024-01-28', status: 'processed' },
                { id: 'PU999', waste: 'Dry Waste', qty: '30 kg', date: '2024-01-25', status: 'processed' },
                { id: 'PU998', waste: 'E-Waste', qty: '12 kg', date: '2024-01-20', status: 'processed' }
            ];
            for (const h of history) {
                await pool.query(
                    "INSERT INTO listings (id, producer_id, category_id, quantity, status, date, collector_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [h.id, pid, h.waste.toLowerCase().includes('dry') ? 'dry' : h.waste.toLowerCase().includes('e-waste') ? 'ewaste' : 'dry', h.qty, h.status, h.date, cid]
                );
            }

            // Current Activity Seeds
            const activities = [
                { type: 'pickup_completed', waste: 'Dry Waste', qty: '25 kg', time_info: '2 hours ago', collector_info: 'Ramesh K.' },
                { type: 'listing_accepted', waste: 'E-Waste', qty: '8 kg', time_info: '5 hours ago', collector_info: 'Suresh M.' },
                { type: 'new_listing', waste: 'Wet Waste', qty: '15 kg', time_info: '1 day ago', description: 'pending' }
            ];
            for (const a of activities) {
                await pool.query(
                    "INSERT INTO activity_logs (user_id, type, waste_info, qty_info, time_info, collector_info, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [pid, a.type, a.waste, a.qty, a.time_info, a.collector_info, a.description || '']
                );
            }

            // Upcoming Pickups Seeds
            const upcoming = [
                { id: 'PU001', cat: 'dry', sub: ['Paper', 'Cardboard'], qty: '20-30 kg', date: '2024-02-01', time: '10:00 AM - 12:00 PM', status: 'accepted', cid: cid },
                { id: 'PU002', cat: 'ewaste', sub: ['Phones', 'Cables'], qty: '5-10 kg', date: '2024-02-02', time: '2:00 PM - 4:00 PM', status: 'listed', cid: null }
            ];
            for (const u of upcoming) {
                await pool.query(
                    "INSERT INTO listings (id, producer_id, category_id, subcategories, quantity, status, date, scheduled_time, collector_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    [u.id, pid, u.cat, JSON.stringify(u.sub), u.qty, u.status, u.date, u.time, u.cid]
                );
            }
        }

        console.log('PostgreSQL database initialized with rich seed data.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
};

initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
