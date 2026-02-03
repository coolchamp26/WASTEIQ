// WasteIQ - Admin Dashboard Page

function renderAdminDashboard(container) {
  const data = WasteIQData.admin;

  container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Dashboard', 'Waste recovery intelligence overview', `
        <button class="btn btn-secondary" onclick="toggleDarkMode()">🌙 Dark Mode</button>
        <button class="btn btn-admin" onclick="BackendService.exportReport()">📊 Export Report</button>
      `)}

      <!-- KPI Cards Row -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        ${data.kpis.map((kpi, i) => `
          <div class="metric-card admin bg-violet animate-slide-up stagger-${i + 1}">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted">${kpi.label}</span>
              <span class="text-xs ${kpi.positive ? 'text-success' : 'text-error'}">${kpi.trend}</span>
            </div>
            <div class="text-3xl font-bold">${kpi.value}</div>
            ${createProgressBar(parseInt(kpi.value) || 75, kpi.positive ? 'var(--color-emerald-500)' : 'var(--color-rose-500)')}
          </div>
        `).join('')}
      </div>

      <div class="admin-grid">
        <!-- Main Chart - Collection Trends -->
        <div class="col-span-8">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">Collection vs Recovery Trends</div>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm active">Weekly</button>
                <button class="btn btn-ghost btn-sm">Monthly</button>
                <button class="btn btn-ghost btn-sm">Yearly</button>
              </div>
            </div>
            <div class="chart-canvas" style="height: 300px;">
              <canvas id="trendsChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Recovery Distribution -->
        <div class="col-span-4">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">Recovery Outcomes</div>
              <a href="#" class="text-sm text-muted" onclick="navigateTo('material-flow')">See All</a>
            </div>
            <div class="chart-canvas" style="height: 250px;">
              <canvas id="recoveryChart"></canvas>
            </div>
            <div class="mt-4 space-y-2">
              ${data.materialFlow.outcomes.map(o => `
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2">
                    <span class="status-dot" style="background: ${o.color};"></span>
                    <span>${o.name}</span>
                  </div>
                  <span class="font-medium">${o.value}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Area Performance -->
        <div class="col-span-6">
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <h3 class="font-semibold">Area Performance</h3>
              <a href="#" class="text-sm text-muted" onclick="navigateTo('heatmaps')">View Heatmap</a>
            </div>
            <div class="card-body p-0">
              ${createTable(
    ['Area', 'Collections', 'Diversion Rate', 'Trend'],
    data.areaPerformance.map(a => [
      `<span class="font-medium">${a.area}</span>`,
      formatNumber(a.collections),
      `<div class="flex items-center gap-2">
                    ${createProgressBar(a.diversion, 'var(--color-emerald-500)')}
                    <span class="text-sm">${a.diversion}%</span>
                  </div>`,
      `<span class="${a.trend === 'up' ? 'text-success' : a.trend === 'down' ? 'text-error' : 'text-muted'}">
                    ${a.trend === 'up' ? '↑' : a.trend === 'down' ? '↓' : '→'}
                  </span>`
    ])
  )}
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="col-span-6">
          <div class="card">
            <div class="card-header"><h3 class="font-semibold">System Overview</h3></div>
            <div class="card-body">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-emerald-50 rounded-xl">
                  <div class="text-sm text-muted mb-1">Total Collected</div>
                  <div class="text-2xl font-bold">${formatNumber(data.overview.totalWasteCollected)} kg</div>
                </div>
                <div class="p-4 bg-sky-50 rounded-xl">
                  <div class="text-sm text-muted mb-1">Total Recovered</div>
                  <div class="text-2xl font-bold">${formatNumber(data.overview.totalRecovered)} kg</div>
                </div>
                <div class="p-4 bg-violet-50 rounded-xl">
                  <div class="text-sm text-muted mb-1">Active Collectors</div>
                  <div class="text-2xl font-bold">${data.overview.activeCollectors}</div>
                </div>
                <div class="p-4 bg-amber-50 rounded-xl">
                  <div class="text-sm text-muted mb-1">Active Producers</div>
                  <div class="text-2xl font-bold">${formatNumber(data.overview.activeProducers)}</div>
                </div>
              </div>
              
              <div class="mt-6 p-4 border border-slate-200 rounded-xl">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-muted">Overall Diversion Rate</span>
                  <span class="font-bold text-lg text-success">${data.overview.diversionRate}%</span>
                </div>
                ${createProgressBar(data.overview.diversionRate, 'linear-gradient(90deg, var(--color-emerald-500), var(--color-teal-400))')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize charts after DOM is ready
  setTimeout(() => initAdminCharts(), 100);
}

function initAdminCharts() {
  const data = WasteIQData.admin;

  // Trends Chart
  const trendsCtx = document.getElementById('trendsChart')?.getContext('2d');
  if (trendsCtx) {
    createAreaChart(trendsCtx, data.trendsData.labels, [
      { label: 'Collected (kg)', data: data.trendsData.collected, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
      { label: 'Recovered (kg)', data: data.trendsData.recovered, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' }
    ]);
  }

  // Recovery Doughnut Chart
  const recoveryCtx = document.getElementById('recoveryChart')?.getContext('2d');
  if (recoveryCtx) {
    const outcomes = data.materialFlow.outcomes;
    createDoughnutChart(
      recoveryCtx,
      outcomes.map(o => o.name),
      outcomes.map(o => o.value),
      outcomes.map(o => o.color)
    );
  }
}

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  showToast(`${isDark ? 'Light' : 'Dark'} mode enabled`, 'success');
}
