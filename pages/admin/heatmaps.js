// WasteIQ - Heatmaps Page

function renderHeatmaps(container) {
    const data = WasteIQData.admin;

    container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Waste Generation Heatmaps', 'Geographic distribution of waste collection activity')}

      <!-- Filter Bar -->
      <div class="card mb-6">
        <div class="card-body flex flex-wrap items-center gap-4">
          <div class="form-group mb-0">
            <label class="form-label">Time Range</label>
            <select class="form-input form-select" style="width: 150px;">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Waste Type</label>
            <select class="form-input form-select" style="width: 150px;">
              <option>All Types</option>
              <option>Dry Waste</option>
              <option>Wet Waste</option>
              <option>E-Waste</option>
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Metric</label>
            <select class="form-input form-select" style="width: 150px;">
              <option>Collection Volume</option>
              <option>Recovery Rate</option>
              <option>Response Time</option>
            </select>
          </div>
          <button class="btn btn-admin mt-4">Apply Filters</button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <!-- Main Heatmap -->
        <div class="heatmap-container">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold">Collection Density</h3>
            <span class="text-sm text-muted">Gurugram Region</span>
          </div>
          
          <!-- Simulated Heatmap Grid -->
          <div class="heatmap-grid mb-4">
            ${data.heatmapData.flat().map(level => `
              <div class="heatmap-cell level-${level}" title="Level ${level}"></div>
            `).join('')}
          </div>
          
          <div class="heatmap-legend">
            <span>Less</span>
            <div class="heatmap-legend-item level-1"></div>
            <div class="heatmap-legend-item level-2"></div>
            <div class="heatmap-legend-item level-3"></div>
            <div class="heatmap-legend-item level-4"></div>
            <div class="heatmap-legend-item level-5"></div>
            <span>More</span>
          </div>
        </div>

        <!-- Recovery Rate Heatmap -->
        <div class="heatmap-container">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold">Recovery Efficiency</h3>
            <span class="text-sm text-muted">By Area</span>
          </div>
          
          <div class="heatmap-grid mb-4">
            ${data.heatmapData.map(row => row.map(v => 6 - v)).flat().map(level => `
              <div class="heatmap-cell level-${Math.max(1, Math.min(5, level))}" title="Level ${level}"></div>
            `).join('')}
          </div>
          
          <div class="heatmap-legend">
            <span>Low</span>
            <div class="heatmap-legend-item" style="background: var(--color-rose-300);"></div>
            <div class="heatmap-legend-item" style="background: var(--color-amber-300);"></div>
            <div class="heatmap-legend-item" style="background: var(--color-emerald-300);"></div>
            <div class="heatmap-legend-item" style="background: var(--color-emerald-400);"></div>
            <div class="heatmap-legend-item" style="background: var(--color-emerald-500);"></div>
            <span>High</span>
          </div>
        </div>
      </div>

      <!-- Area Breakdown -->
      <div class="card mt-6">
        <div class="card-header"><h3 class="font-semibold">Detailed Area Breakdown</h3></div>
        <div class="card-body p-0">
          ${createTable(
        ['Zone', 'Total Collected', 'Recovered', 'Diversion %', 'Avg Pickup Time', 'Status'],
        data.areaPerformance.map(a => [
            `<span class="font-medium">${a.area}</span>`,
            `${formatNumber(a.collections * 37)} kg`,
            `${formatNumber(Math.round(a.collections * 37 * a.diversion / 100))} kg`,
            `<span class="${a.diversion >= 80 ? 'text-success' : a.diversion >= 60 ? 'text-warning' : 'text-error'} font-semibold">${a.diversion}%</span>`,
            `${Math.round(25 + Math.random() * 20)} min`,
            `<span class="badge ${a.trend === 'up' ? 'badge-success' : a.trend === 'down' ? 'badge-error' : 'badge-neutral'}">
                ${a.trend === 'up' ? 'Improving' : a.trend === 'down' ? 'Declining' : 'Stable'}
              </span>`
        ])
    )}
        </div>
      </div>
    </div>
  `;
}
