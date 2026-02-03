// WasteIQ - Producer Dashboard Page

async function renderProducerDashboard(container) {
  const userId = document.body.getAttribute('data-user-id');

  // Refresh data from backend to ensure we have latest statuses
  if (userId) {
    await BackendService.fetchDashboardData('producer', userId);
  }

  const data = WasteIQData.producer;

  container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Dashboard', `Welcome back, ${data.profile.name}`)}
      
      <!-- Metrics Grid -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        ${createMetricCard({
    icon: '♻️',
    iconClass: 'success',
    value: formatNumber(data.metrics.wasteDiverted) + ' kg',
    label: 'Waste Diverted',
    trend: '+12% this month',
    trendUp: true,
    roleClass: 'producer'
  })}
        ${createMetricCard({
    icon: '🚛',
    iconClass: 'info',
    value: data.metrics.pickupsCompleted,
    label: 'Pickups Completed',
    trend: '+8 this week',
    trendUp: true,
    roleClass: 'producer'
  })}
        ${createMetricCard({
    icon: '🌱',
    iconClass: 'success',
    value: formatNumber(data.metrics.co2Saved) + ' kg',
    label: 'CO₂ Saved',
    trend: 'Equivalent to 45 trees',
    trendUp: true,
    roleClass: 'producer'
  })}
        ${createMetricCard({
    icon: '🔥',
    iconClass: 'warning',
    value: data.metrics.streak + ' days',
    label: 'Green Streak',
    trend: 'Keep it up!',
    trendUp: true,
    roleClass: 'producer'
  })}
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Quick Actions & Status -->
        <div class="col-span-4 flex flex-col gap-6">
          <div class="card h-full">
            <div class="card-header"><h3 class="font-semibold">Quick Actions</h3></div>
            <div class="card-body">
              <div class="flex flex-col gap-3">
                <button class="btn btn-primary btn-block" onclick="navigateTo('list-waste')">
                  ${getIcon('plus')} List New Waste
                </button>
                <button class="btn btn-secondary btn-block" onclick="navigateTo('schedule')">
                  ${getIcon('calendar')} Schedule Pickup
                </button>
                <button class="btn btn-secondary btn-block" onclick="navigateTo('tracking')">
                  ${getIcon('activity')} Track Pickups
                </button>
              </div>
            </div>
          </div>
          
          <!-- Active Status -->
          <div class="card">
            <div class="card-header"><h3 class="font-semibold">Current Status</h3></div>
            <div class="card-body">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-muted">Active Listings</span>
                <span class="font-semibold">${data.metrics.activeListings}</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-muted">Pending Pickups</span>
                <span class="font-semibold">${data.metrics.pendingPickups}</span>
              </div>
              ${createProgressBar(75)}
              <p class="text-xs text-muted mt-2">75% of monthly goal achieved</p>
            </div>
          </div>
        </div>

        <!-- Activity & Pickups -->
        <div class="col-span-8 flex flex-col gap-6">
          <!-- Recent Activity -->
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <h3 class="font-semibold">Recent Activity</h3>
              <a href="#" class="text-sm text-success" onclick="navigateTo('tracking')">View All</a>
            </div>
            <div class="card-body p-0">
              <ul class="list">
                ${data.recentActivity.map(activity => {
    const cat = getWasteCategory(activity.waste);
    return `
                  <li class="list-item flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="avatar avatar-sm" style="background: ${activity.type === 'pickup_completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(14, 165, 233, 0.15)'}; color: ${activity.type === 'pickup_completed' ? 'var(--color-emerald-600)' : 'var(--color-sky-600)'};">
                        ${activity.type === 'pickup_completed' ? '✓' : activity.type === 'listing_accepted' ? '👋' : '📋'}
                      </div>
                      <div>
                        <div class="font-medium">${cat?.name || activity.waste} - ${activity.qty}</div>
                        <div class="text-sm text-muted">${activity.collector || activity.status || ''} • ${activity.time}</div>
                      </div>
                    </div>
                    ${activity.type === 'pickup_completed' ? '<span class="badge badge-success">Completed</span>' :
        activity.type === 'listing_accepted' ? '<span class="badge badge-info">Accepted</span>' :
          '<span class="badge badge-warning">Pending</span>'}
                  </li>
                `}).join('')}
              </ul>
            </div>
          </div>

          <!-- Upcoming Pickups -->
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <h3 class="font-semibold">Upcoming Pickups</h3>
              <span class="badge badge-info">${data.activePickups.length} scheduled</span>
            </div>
            <div class="card-body p-0">
              <ul class="list">
                ${data.activePickups.slice(0, 3).map(pickup => {
            const cat = getWasteCategory(pickup.waste);
            return `
                  <li class="list-item flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="avatar avatar-sm" style="background: rgba(16, 185, 129, 0.1); color: var(--color-emerald-600);">
                        ${pickup.status === 'picked' ? '🚛' : (cat?.icon || '⏳')}
                      </div>
                      <div>
                        <div class="font-medium">${cat?.name || pickup.waste}</div>
                        <div class="text-sm text-muted">${pickup.quantity} • ${pickup.scheduledTime} (${formatDate(pickup.scheduledDate)})</div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      ${createBadge(pickup.status)}
                      ${pickup.collector ? `<div class="text-[10px] text-muted uppercase font-bold tracking-wider">${pickup.collector.name}</div>` : ''}
                    </div>
                  </li>
    `;
          }).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
