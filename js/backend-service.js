// WasteIQ - Backend API Service
// Handles communication with the real PostgreSQL backend

const BackendService = {
    API_BASE: window.location.origin,

    // Initialize Backend
    async init() {
        console.log('BackendService: Initializing...');
        // In the real version, we don't need to seed LocalStorage
        // The server handles data persistence
    },

    async fetchDashboardData(role, id) {
        console.log(`[BackendService] Fetching ${role} dashboard for ID: ${id}`);
        try {
            const url = `${this.API_BASE}/api/dashboard/${role}/${id}`;
            console.log('[BackendService] Executing fetch ->', url);

            const response = await fetch(url);
            console.log('[BackendService] Response Status:', response.status);

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const result = await response.json();
            console.log('[BackendService] Data received:', result.success ? 'Success' : 'Fail');

            if (result.success) {
                if (role === 'producer') {
                    Object.assign(WasteIQData.producer.metrics, result.data.metrics);
                    WasteIQData.producer.recentActivity = result.data.recentActivity;
                    WasteIQData.producer.activePickups = result.data.activePickups;
                    WasteIQData.producer.history = result.data.history;
                    console.log('[BackendService] Producer state updated. Active count:', WasteIQData.producer.activePickups.length);
                } else if (role === 'collector') {
                    WasteIQData.collector.activeJobs = result.data.activeJobs;
                    WasteIQData.collector.completedToday = result.data.completedToday;
                }
                return result.data;
            }
        } catch (error) {
            console.error('BackendService: Error fetching dashboard:', error);
            showToast('Connection error. Using cached data.', 'warning');
            return null;
        }
    },

    // Producer: Create a new listing
    async createListing(listingData) {
        try {
            const response = await fetch(`${this.API_BASE}/api/listing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listingData)
            });

            if (!response.ok) throw new Error('Listing failed');

            const result = await response.json();
            if (result.success) {
                // Refresh dashboard data to ensure UI is in sync
                await this.fetchDashboardData('producer', listingData.producerId);
                return { success: true, pickupId: result.listingId };
            }
        } catch (error) {
            console.error('BackendService: Listing error:', error);
            return { success: false, error: error.message };
        }
    },

    // Collector: Accept a listing
    async acceptPickup(listingId, collectorId) {
        try {
            const response = await fetch(`${this.API_BASE}/api/pickup/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId, collectorId })
            });
            if (!response.ok) throw new Error('Failed to accept pickup');

            const result = await response.json();
            if (result.success) {
                // Refresh local data
                await this.fetchDashboardData('collector', collectorId);
                return { success: true };
            }
        } catch (error) {
            console.error('BackendService: Accept error:', error);
            return { success: false, error: error.message };
        }
    },

    // Collector: Complete a pickup
    async completePickup(listingId, collectorId) {
        try {
            const response = await fetch(`${this.API_BASE}/api/pickup/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId, collectorId })
            });
            if (!response.ok) throw new Error('Failed to complete pickup');

            const result = await response.json();
            if (result.success) {
                // Refresh local data
                await this.fetchDashboardData('collector', collectorId);
                return { success: true };
            }
        } catch (error) {
            console.error('BackendService: Complete error:', error);
            return { success: false, error: error.message };
        }
    },

    // Admin: Export Report as CSV
    exportReport() {
        // ... implementation could be moved to server-side for real large datasets
        // For now, keeping the mock logic using the latest backend data
        const headers = ['Area', 'Collections', 'Diversion Rate', 'Trend'];
        const rows = WasteIQData.admin.areaPerformance.map(a => [
            a.area,
            a.collections,
            a.diversion + '%',
            a.trend.toUpperCase()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\r\n";
        rows.forEach(row => {
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "wasteiq_report_" + new Date().toISOString().slice(0, 10) + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { success: true };
    }
};

// Initial sync on startup if a user is already "present" (for demo persistence)
window.addEventListener('load', () => BackendService.init());
