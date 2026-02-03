// WasteIQ - Material Flow Page

function renderMaterialFlow(container) {
  const data = WasteIQData.admin;

  container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Material Flow Tracking', 'Source to recovery pathway analysis')}

      <!-- Flow Summary Cards -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        ${data.materialFlow.sources.map((s, i) => `
          <div class="card animate-slide-up stagger-${i + 1}">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">${['🏢', '🏬', '🏭', '🎉'][i]}</div>
              <div class="text-2xl font-bold">${s.value}%</div>
              <div class="text-sm text-muted">${s.name}</div>
              ${createProgressBar(s.value, ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b'][i])}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Sankey-style Flow Visualization -->
      <div class="card mb-6">
        <div class="card-header"><h3 class="font-semibold">Waste Flow Diagram</h3></div>
        <div class="card-body">
          <div class="flex items-center justify-between gap-8">
            <!-- Sources -->
            <div class="flex-1">
              <h4 class="text-sm text-muted mb-4 text-center">Sources</h4>
              <div class="space-y-3">
                ${data.materialFlow.sources.map((s, i) => `
                  <div class="p-3 rounded-lg text-center" style="background: ${['#dcfce7', '#e0f2fe', '#f3e8ff', '#fef3c7'][i]}; color: var(--color-slate-900);">
                    <div class="font-semibold">${s.name}</div>
                    <div class="text-sm" style="color: var(--color-slate-600);">${s.value}%</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Flow Lines -->
            <div class="flex-1 flex flex-col items-center justify-center" style="min-height: 300px;">
              <svg width="200" height="280" viewBox="0 0 200 280">
                <!-- Flow paths -->
                <path d="M 0 35 Q 100 35 200 35" stroke="#10b981" stroke-width="8" fill="none" opacity="0.3"/>
                <path d="M 0 100 Q 100 80 200 70" stroke="#0ea5e9" stroke-width="6" fill="none" opacity="0.3"/>
                <path d="M 0 165 Q 100 140 200 105" stroke="#8b5cf6" stroke-width="5" fill="none" opacity="0.3"/>
                <path d="M 0 230 Q 100 200 200 175" stroke="#f59e0b" stroke-width="4" fill="none" opacity="0.3"/>
                
                <!-- Central Hub -->
                <circle cx="100" cy="140" r="30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
                <text x="100" y="135" text-anchor="middle" fill="#334155" font-size="10" font-weight="600">WasteIQ</text>
                <text x="100" y="150" text-anchor="middle" fill="#64748b" font-size="8">Processing</text>
              </svg>
            </div>

            <!-- Outcomes -->
            <div class="flex-1">
              <h4 class="text-sm text-muted mb-4 text-center">Recovery Outcomes</h4>
              <div class="space-y-3">
                ${data.materialFlow.outcomes.map(o => `
                  <div class="p-3 rounded-lg" style="background: ${o.color}15; border-left: 4px solid ${o.color};">
                    <div class="flex justify-between items-center">
                      <span class="font-semibold">${o.name}</span>
                      <span class="font-bold" style="color: ${o.color};">${o.value}%</span>
                    </div>
                    ${createProgressBar(o.value, o.color)}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div class="grid grid-cols-2 gap-6">
        <div class="chart-container">
          <div class="chart-header">
            <div class="chart-title">Source Distribution</div>
          </div>
          <div class="chart-canvas" style="height: 250px;">
            <canvas id="sourceChart"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <div class="chart-title">Recovery by Material Type</div>
          </div>
          <div class="chart-canvas" style="height: 250px;">
            <canvas id="materialChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Impact Metrics -->
      <div class="card mt-6">
        <div class="card-header"><h3 class="font-semibold">Environmental Impact</h3></div>
        <div class="card-body">
          <div class="grid grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-4xl mb-2">🌍</div>
              <div class="text-2xl font-bold text-success">${formatNumber(data.overview.totalRecovered)}</div>
              <div class="text-sm text-muted">kg Waste Recovered</div>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-2">🌳</div>
              <div class="text-2xl font-bold text-success">${formatNumber(Math.round(data.overview.totalRecovered * 0.02))}</div>
              <div class="text-sm text-muted">Trees Equivalent Saved</div>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-2">💧</div>
              <div class="text-2xl font-bold text-info">${formatNumber(Math.round(data.overview.totalRecovered * 3.5))}</div>
              <div class="text-sm text-muted">Liters Water Saved</div>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-2">⚡</div>
              <div class="text-2xl font-bold text-violet-500">${formatNumber(Math.round(data.overview.totalRecovered * 0.8))}</div>
              <div class="text-sm text-muted">kWh Energy Saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize charts
  setTimeout(() => {
    const sourceCtx = document.getElementById('sourceChart')?.getContext('2d');
    if (sourceCtx) {
      createDoughnutChart(sourceCtx,
        data.materialFlow.sources.map(s => s.name),
        data.materialFlow.sources.map(s => s.value),
        ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b']
      );
    }

    const materialCtx = document.getElementById('materialChart')?.getContext('2d');
    if (materialCtx) {
      createBarChart(materialCtx,
        ['Dry', 'Wet', 'E-Waste', 'Debris'],
        [{ label: 'Recovered %', data: [92, 78, 85, 45], colors: ['#10b981', '#22c55e', '#8b5cf6', '#64748b'] }]
      );
    }
  }, 100);
}
