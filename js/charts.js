// WasteIQ - Chart.js Integration

// Chart color schemes
const ChartColors = {
    emerald: { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
    sky: { bg: 'rgba(14, 165, 233, 0.2)', border: '#0ea5e9' },
    violet: { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6' },
    amber: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b' },
    rose: { bg: 'rgba(244, 63, 94, 0.2)', border: '#f43f5e' },
    slate: { bg: 'rgba(100, 116, 139, 0.2)', border: '#64748b' }
};

// Default chart options
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { labels: { font: { family: 'Inter', size: 12 }, color: '#64748b' } }
    },
    scales: {
        x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' } }
    }
};

// Create line chart
function createLineChart(ctx, labels, datasets, options = {}) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels, datasets: datasets.map((ds, i) => ({
                label: ds.label,
                data: ds.data,
                borderColor: ds.color || Object.values(ChartColors)[i].border,
                backgroundColor: ds.bgColor || Object.values(ChartColors)[i].bg,
                fill: ds.fill !== false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }))
        },
        options: { ...defaultChartOptions, ...options }
    });
}

// Create bar chart
function createBarChart(ctx, labels, datasets, options = {}) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels, datasets: datasets.map((ds, i) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: ds.colors || Object.values(ChartColors)[i].bg,
                borderColor: ds.borderColors || Object.values(ChartColors)[i].border,
                borderWidth: 1,
                borderRadius: 6
            }))
        },
        options: { ...defaultChartOptions, ...options }
    });
}

// Create doughnut chart
function createDoughnutChart(ctx, labels, data, colors, options = {}) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 }, padding: 20, color: '#64748b' } }
            },
            cutout: '65%',
            ...options
        }
    });
}

// Create area chart (line with fill)
function createAreaChart(ctx, labels, datasets, options = {}) {
    return createLineChart(ctx, labels, datasets.map(ds => ({ ...ds, fill: true })), options);
}

// Destroy chart if exists
function destroyChart(chartInstance) {
    if (chartInstance) chartInstance.destroy();
}
