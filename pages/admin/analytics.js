// WasteIQ - Analytics Page

function renderAnalytics(container) {
    const data = WasteIQData.admin;

    container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Analytics & Trends', 'Deep dive into operational metrics', `
        <button class="btn btn-secondary">📅 Date Range</button>
        <button class="btn btn-admin">📥 Export Data</button>
      `)}

      <!-- Key Metrics Row -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="metric-card admin">
          <div class="flex justify-between items-start mb-2">
            <span class="text-muted text-sm">Diversion Rate</span>
            <span class="badge badge-success">+3.2%</span>
          </div>
          <div class="text-3xl font-bold mb-2">${data.overview.diversionRate}%</div>
          ${createProgressBar(data.overview.diversionRate)}
        </div>
        <div class="metric-card admin">
          <div class="flex justify-between items-start mb-2">
            <span class="text-muted text-sm">Avg Pickup Time</span>
            <span class="badge badge-success">-5 min</span>
          </div>
          <div class="text-3xl font-bold mb-2">${data.overview.avgPickupTime} min</div>
          ${createProgressBar(100 - data.overview.avgPickupTime, 'var(--color-sky-500)')}
        </div>
        <div class="metric-card admin">
          <div class="flex justify-between items-start mb-2">
            <span class="text-muted text-sm">Collector Utilization</span>
            <span class="badge badge-warning">-2.1%</span>
          </div>
          <div class="text-3xl font-bold mb-2">78%</div>
          ${createProgressBar(78, 'var(--color-amber-500)')}
        </div>
        <div class="metric-card admin">
          <div class="flex justify-between items-start mb-2">
            <span class="text-muted text-sm">Producer Retention</span>
            <span class="badge badge-success">+1.5%</span>
          </div>
          <div class="text-3xl font-bold mb-2">94%</div>
          ${createProgressBar(94, 'var(--color-violet-500)')}
        </div>
      </div>

      <div class="admin-grid">
        <!-- Main Trends Chart -->
        <div class="col-span-8">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">Weekly Performance Trends</div>
              <div class="flex gap-2">
                ${createTabs([
        { id: 'volume', label: 'Volume' },
        { id: 'rate', label: 'Rate' },
        { id: 'time', label: 'Response' }
    ], 'volume')}
              </div>
            </div>
            <div class="chart-canvas" style="height: 350px;">
              <canvas id="analyticsChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Top Collectors -->
        <div class="col-span-4">
          <div class="card h-full">
            <div class="card-header flex justify-between items-center">
              <h3 class="font-semibold">Top Collectors</h3>
              <span class="badge badge-neutral">This Week</span>
            </div>
            <div class="card-body p-0">
              <ul class="list">
                ${[
            { name: 'Ramesh Kumar', pickups: 45, rating: 4.9 },
            { name: 'Suresh Yadav', pickups: 42, rating: 4.8 },
            { name: 'Mohan Singh', pickups: 38, rating: 4.7 },
            { name: 'Raj Patel', pickups: 35, rating: 4.8 },
            { name: 'Vikram Sharma', pickups: 33, rating: 4.6 }
        ].map((c, i) => `
                  <li class="list-item flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="font-bold text-muted text-lg" style="width: 24px;">#${i + 1}</div>
                      <div class="avatar-sm">${c.name.charAt(0)}</div>
                      <div>
                        <div class="font-medium">${c.name}</div>
                        <div class="text-xs text-muted">${c.pickups} pickups</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 text-amber-500">
                      ${getIcon('star')} ${c.rating}
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Waste Type Distribution -->
        <div class="col-span-6">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">Collection by Waste Type</div>
            </div>
            <div class="chart-canvas" style="height: 280px;">
              <canvas id="wasteTypeChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Time Distribution -->
        <div class="col-span-6">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">Pickup Distribution by Hour</div>
            </div>
            <div class="chart-canvas" style="height: 280px;">
              <canvas id="hourlyChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="card mt-6">
        <div class="card-header"><h3 class="font-semibold">AI-Powered Insights</h3></div>
        <div class="card-body">
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
              <div class="font-semibold text-emerald-700 mb-2">📈 Growth Opportunity</div>
              <p class="text-sm text-emerald-600">Sector 22-26 shows 15% higher demand on weekends. Consider adding 2 more collectors.</p>
            </div>
            <div class="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
              <div class="font-semibold text-amber-700 mb-2">⚠️ Attention Needed</div>
              <p class="text-sm text-amber-600">Response time in Old Gurugram increased by 12 min. Route optimization recommended.</p>
            </div>
            <div class="p-4 bg-sky-50 rounded-xl border-l-4 border-sky-500">
              <div class="font-semibold text-sky-700 mb-2">💡 Suggestion</div>
              <p class="text-sm text-sky-600">E-waste collections peak on 1st week of month. Schedule targeted campaigns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    // Initialize charts
    setTimeout(() => initAnalyticsCharts(), 100);
}

function initAnalyticsCharts() {
    const data = WasteIQData.admin;

    // Main analytics chart
    const analyticsCtx = document.getElementById('analyticsChart')?.getContext('2d');
    if (analyticsCtx) {
        createLineChart(analyticsCtx, data.trendsData.labels, [
            { label: 'Collections', data: data.trendsData.collected, color: '#8b5cf6' },
            { label: 'Recovery', data: data.trendsData.recovered, color: '#10b981' },
            { label: 'Target', data: [3500, 3500, 3500, 3500, 3500, 3500], color: '#64748b', fill: false }
        ]);
    }

    // Waste type chart
    const wasteTypeCtx = document.getElementById('wasteTypeChart')?.getContext('2d');
    if (wasteTypeCtx) {
        createBarChart(wasteTypeCtx,
            ['Dry Waste', 'Wet Waste', 'E-Waste', 'Debris'],
            [{ label: 'Volume (kg)', data: [18500, 12300, 4200, 3100], colors: ['#f59e0b', '#22c55e', '#8b5cf6', '#64748b'] }]
        );
    }

    // Hourly distribution
    const hourlyCtx = document.getElementById('hourlyChart')?.getContext('2d');
    if (hourlyCtx) {
        createBarChart(hourlyCtx,
            ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'],
            [{ label: 'Pickups', data: [45, 120, 95, 60, 85, 110, 40], colors: 'rgba(14, 165, 233, 0.6)' }]
        );
    }
}
