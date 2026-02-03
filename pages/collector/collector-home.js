// WasteIQ - Collector Home Page (Nearby Jobs)

async function renderCollectorHome(container) {
  const data = WasteIQData.collector;

  const role = 'collector';
  const userId = document.body.getAttribute('data-user-id');

  // Show loading state while fetching available jobs
  container.innerHTML = `
    <div class="animate-fade-in collector-view">
      ${createPageHeader('Nearby Pickups', data.profile.zone)}
      <div class="flex items-center justify-center p-12"><div class="loader"></div></div>
    </div>`;

  try {
    // 1. Sync dashboard data (Active Jobs, completed counts)
    await BackendService.fetchDashboardData(role, userId);

    // 2. Fetch available listings
    const response = await fetch('/api/listings/available');
    const result = await response.json();

    if (result.success) {
      data.nearbyPickups = result.listings;
    }
  } catch (err) {
    console.error('Failed to fetch available listings:', err);
    showToast('Error loading available jobs', 'error');
  }

  container.innerHTML = `
    <div class="animate-fade-in collector-view">
      ${createPageHeader('Nearby Pickups', data.profile.zone)}
      
      <!-- Earnings Summary -->
      <div class="grid mobile-grid-2 grid-cols-4 gap-4 mb-6">
        ${createMetricCard({ icon: '💰', iconClass: 'info', value: formatCurrency(data.earnings.today), label: "Today's Earnings", roleClass: 'collector' })}
        ${createMetricCard({ icon: '📦', iconClass: 'success', value: data.completedToday.length, label: 'Pickups Today', roleClass: 'collector' })}
        ${createMetricCard({ icon: '⏳', iconClass: 'warning', value: formatCurrency(data.earnings.pending), label: 'Pending', roleClass: 'collector', trend: '', trendUp: true })}
        ${createMetricCard({ icon: '⭐', iconClass: 'info', value: data.profile.rating, label: 'Your Rating', roleClass: 'collector' })}
      </div>

      <!-- Active Job Alert -->
      ${data.activeJobs.length > 0 ? `
        <div class="card mb-6 shadow-sky border-2 border-sky-500 bg-sky-50 animate-pulse-subtle">
          <div class="card-body">
            <div class="flex items-center justify-between mb-3">
              <span class="badge badge-info shadow-sm">Active Job</span>
              <span class="text-sm font-bold text-sky-700">${data.activeJobs[0].pickupTime}</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-lg text-slate-800">${data.activeJobs[0].producer}</div>
                <div class="text-sm text-slate-600 font-medium">${data.activeJobs[0].wasteType} • ${data.activeJobs[0].quantity}</div>
              </div>
              <button class="btn btn-collector shadow-lg" onclick="navigateTo('confirm')">
                Continue →
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Nearby Pickups List -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold">Available Jobs</h3>
        <span class="badge badge-neutral">${data.nearbyPickups.length} nearby</span>
      </div>

      <div class="space-y-4">
        ${data.nearbyPickups.length > 0
      ? data.nearbyPickups.map(pickup => createCollectorPickupCard(pickup)).join('')
      : createEmptyState('🚛', 'No Available Jobs', 'Check back later for new waste collection requests.')
    }
      </div>

      <div class="swipe-indicator mt-6" onclick="renderCollectorHome(document.getElementById('main-content'))" style="cursor: pointer;">
        Tap to refresh
      </div>
    </div>
  `;
}

async function viewJobDetails(pickupId) {
  const userId = document.body.getAttribute('data-user-id');

  if (confirm('Accept this collection job?')) {
    const result = await BackendService.acceptPickup(pickupId, userId);
    if (result.success) {
      showToast('Job Accepted! Navigating to Active Jobs', 'success');
      setTimeout(() => navigateTo('active'), 1000);
    } else {
      showToast(result.error, 'error');
    }
  }
}
