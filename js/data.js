// WasteIQ - Mock Data Store

const WasteIQData = {
  // Current user state
  currentRole: null,
  currentPage: null,

  // Waste Categories & Templates
  wasteCategories: [
    {
      id: 'dry',
      name: 'Dry Waste',
      icon: '📦',
      color: '#f59e0b',
      subcategories: ['Paper', 'Cardboard', 'Plastic Bottles', 'Metal Cans', 'Glass'],
      recoveryPath: 'recycle',
      priceRange: '₹5 - ₹15 per kg'
    },
    {
      id: 'wet',
      name: 'Wet Waste',
      icon: '🥬',
      color: '#22c55e',
      subcategories: ['Food Scraps', 'Garden Waste', 'Organic Matter'],
      recoveryPath: 'compost',
      priceRange: '₹2 - ₹5 per kg'
    },
    {
      id: 'ewaste',
      name: 'E-Waste',
      icon: '💻',
      color: '#8b5cf6',
      subcategories: ['Computers', 'Phones', 'Cables', 'Batteries', 'Appliances'],
      recoveryPath: 'specialized',
      priceRange: '₹20 - ₹100 per kg'
    },
    {
      id: 'debris',
      name: 'Debris',
      icon: '🧱',
      color: '#64748b',
      subcategories: ['Construction Waste', 'Tiles', 'Concrete', 'Wood'],
      recoveryPath: 'landfill',
      priceRange: 'Charges apply'
    }
  ],

  // Quantity Ranges
  quantityRanges: [
    { id: 'small', label: '< 5 kg', value: 5 },
    { id: 'medium', label: '5 - 20 kg', value: 20 },
    { id: 'large', label: '20 - 50 kg', value: 50 },
    { id: 'bulk', label: '50 - 100 kg', value: 100 },
    { id: 'xlarge', label: '> 100 kg', value: 150 }
  ],

  // Producer Mock Data
  producer: {
    profile: {
      name: 'Green Valley Apartments',
      type: 'Residential Society',
      address: 'Block A, Sector 15, Gurugram',
      units: 120,
      contact: '+91 98765 43210'
    },
    metrics: {
      wasteDiverted: 2450,
      pickupsCompleted: 156,
      co2Saved: 890,
      activeListings: 3,
      pendingPickups: 2,
      streak: 45
    },
    recentActivity: [
      { id: 1, type: 'pickup_completed', waste: 'Dry Waste', qty: '25 kg', time: '2 hours ago', collector: 'Ramesh K.' },
      { id: 2, type: 'listing_accepted', waste: 'E-Waste', qty: '8 kg', time: '5 hours ago', collector: 'Suresh M.' },
      { id: 3, type: 'new_listing', waste: 'Wet Waste', qty: '15 kg', time: '1 day ago', status: 'pending' }
    ],
    activePickups: [
      {
        id: 'PU001',
        waste: 'Dry Waste',
        subcategories: ['Paper', 'Cardboard'],
        quantity: '20-30 kg',
        scheduledDate: '2024-02-01',
        scheduledTime: '10:00 AM - 12:00 PM',
        status: 'accepted',
        collector: { name: 'Ramesh Kumar', phone: '+91 98765 12345', rating: 4.8 }
      },
      {
        id: 'PU002',
        waste: 'E-Waste',
        subcategories: ['Phones', 'Cables'],
        quantity: '5-10 kg',
        scheduledDate: '2024-02-02',
        scheduledTime: '2:00 PM - 4:00 PM',
        status: 'listed',
        collector: null
      }
    ],
    history: [
      { id: 'PU000', waste: 'Mixed', qty: '45 kg', date: '2024-01-28', status: 'processed', earnings: '₹225' },
      { id: 'PU999', waste: 'Dry Waste', qty: '30 kg', date: '2024-01-25', status: 'processed', earnings: '₹180' },
      { id: 'PU998', waste: 'E-Waste', qty: '12 kg', date: '2024-01-20', status: 'processed', earnings: '₹600' }
    ]
  },

  // Collector Mock Data
  collector: {
    profile: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 12345',
      rating: 4.8,
      completedPickups: 342,
      zone: 'Sector 14-18, Gurugram'
    },
    earnings: {
      today: 450,
      week: 3250,
      month: 12800,
      pending: 675
    },
    nearbyPickups: [
      {
        id: 'PU101',
        producer: 'Sunrise Apartments',
        address: 'Block C, Sector 16',
        distance: '0.8 km',
        wasteType: 'Dry Waste',
        estimatedQty: '25-30 kg',
        estimatedEarning: '₹150-180',
        scheduledTime: '10:00 AM - 12:00 PM',
        urgency: 'normal'
      },
      {
        id: 'PU102',
        producer: 'TechHub Office',
        address: 'Tower B, Sector 15',
        distance: '1.2 km',
        wasteType: 'E-Waste',
        estimatedQty: '10-15 kg',
        estimatedEarning: '₹400-600',
        scheduledTime: '2:00 PM - 4:00 PM',
        urgency: 'high'
      },
      {
        id: 'PU103',
        producer: 'Green Cafe',
        address: 'Main Road, Sector 14',
        distance: '2.1 km',
        wasteType: 'Wet Waste',
        estimatedQty: '40-50 kg',
        estimatedEarning: '₹100-150',
        scheduledTime: '6:00 AM - 8:00 AM',
        urgency: 'low'
      }
    ],
    activeJobs: [
      {
        id: 'PU100',
        producer: 'Green Valley Apartments',
        address: 'Block A, Sector 15',
        distance: '1.2 km',
        wasteType: 'Dry Waste',
        estimatedQty: '20-30 kg',
        estimatedEarning: '₹120-150',
        status: 'in_transit',
        otp: '4521',
        pickupTime: '10:30 AM',
        scheduledTime: '10:00 AM - 12:00 PM'
      }
    ],
    completedToday: [
      { id: 'PU099', producer: 'City Mall', wasteType: 'Dry Waste', qty: '15 kg', earning: '₹90', time: '8:15 AM' },
      { id: 'PU098', producer: 'Royal Residency', wasteType: 'Mixed', qty: '35 kg', earning: '₹210', time: '7:00 AM' }
    ]
  },

  // Admin Mock Data
  admin: {
    profile: {
      name: 'Admin User',
      role: 'System Administrator',
      email: 'admin@wasteiq.com'
    },
    overview: {
      totalWasteCollected: 45600,
      totalRecovered: 38760,
      diversionRate: 85,
      activeCollectors: 156,
      activeProducers: 1240,
      avgPickupTime: 45
    },
    kpis: [
      { label: 'Diversion Rate', value: '85%', trend: '+3.2%', positive: true },
      { label: 'Recovery Efficiency', value: '91%', trend: '+1.8%', positive: true },
      { label: 'Collector Utilization', value: '78%', trend: '-2.1%', positive: false },
      { label: 'Avg Response Time', value: '28 min', trend: '-5 min', positive: true }
    ],
    areaPerformance: [
      { area: 'Sector 14-18', collections: 1250, diversion: 88, trend: 'up' },
      { area: 'Sector 22-26', collections: 980, diversion: 82, trend: 'up' },
      { area: 'Sector 29-33', collections: 756, diversion: 79, trend: 'down' },
      { area: 'DLF Phase 1-3', collections: 1450, diversion: 91, trend: 'up' },
      { area: 'Old Gurugram', collections: 520, diversion: 65, trend: 'stable' }
    ],
    materialFlow: {
      sources: [
        { name: 'Residential', value: 45 },
        { name: 'Commercial', value: 30 },
        { name: 'Industrial', value: 15 },
        { name: 'Events', value: 10 }
      ],
      outcomes: [
        { name: 'Recycled', value: 55, color: '#10b981' },
        { name: 'Composted', value: 25, color: '#22c55e' },
        { name: 'Reused', value: 12, color: '#0ea5e9' },
        { name: 'Landfill', value: 8, color: '#64748b' }
      ]
    },
    trendsData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      collected: [3200, 3450, 3100, 3800, 4100, 4250],
      recovered: [2720, 2932, 2635, 3230, 3485, 3612]
    },
    heatmapData: [
      // Grid data for heatmap visualization (7x7 grid)
      [2, 3, 4, 5, 4, 3, 2],
      [3, 4, 5, 5, 5, 4, 3],
      [4, 5, 5, 4, 5, 5, 4],
      [3, 4, 4, 3, 4, 4, 3],
      [2, 3, 3, 4, 3, 3, 2],
      [1, 2, 2, 3, 2, 2, 1],
      [1, 1, 2, 2, 2, 1, 1]
    ]
  },

  // Status Mappings
  statusMap: {
    listed: { label: 'Listed', color: '#f59e0b', icon: '📋' },
    accepted: { label: 'Accepted', color: '#0ea5e9', icon: '✓' },
    in_transit: { label: 'In Transit', color: '#8b5cf6', icon: '🚛' },
    picked: { label: 'Picked Up', color: '#22c55e', icon: '📦' },
    processed: { label: 'Processed', color: '#10b981', icon: '♻️' }
  },

  // Navigation configs per role
  navigation: {
    producer: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'list-waste', label: 'List Waste', icon: '➕' },
      { id: 'schedule', label: 'Schedule', icon: '📅' },
      { id: 'tracking', label: 'Track', icon: '📍' }
    ],
    collector: [
      { id: 'home', label: 'Jobs', icon: '📍' },
      { id: 'active', label: 'Active', icon: '🚛' },
      { id: 'confirm', label: 'Confirm', icon: '✓' },
      { id: 'earnings', label: 'Earnings', icon: '💰' }
    ],
    admin: [
      { id: 'dashboard', label: 'Overview', icon: '📊' },
      { id: 'heatmaps', label: 'Heatmaps', icon: '🗺️' },
      { id: 'material-flow', label: 'Flow', icon: '🔄' },
      { id: 'analytics', label: 'Analytics', icon: '📈' }
    ]
  }
};

// Helper functions for data access
function getWasteCategory(id) {
  return WasteIQData.wasteCategories.find(cat => cat.id === id);
}

function getStatusInfo(status) {
  return WasteIQData.statusMap[status] || { label: status, color: '#64748b', icon: '•' };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
