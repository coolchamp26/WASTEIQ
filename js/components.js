// WasteIQ - Reusable UI Components

const Icons = {
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  calendar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  activity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'map-pin': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  truck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  'check-circle': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  wallet: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  'bar-chart': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  map: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  'git-branch': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  'trending-up': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  'chevron-right': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  x: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

function getIcon(name) { return Icons[name] || ''; }

function createMetricCard(config) {
  const { icon, iconClass, value, label, trend, trendUp, roleClass = 'producer' } = config;
  const bgClass = { producer: 'bg-emerald', collector: 'bg-sky', admin: 'bg-violet' }[roleClass] || '';

  return `<div class="metric-card ${roleClass} ${bgClass} animate-slide-up">
    <div class="metric-icon ${iconClass || 'success'}">${icon}</div>
    <div class="metric-value">${value}</div>
    <div class="metric-label">${label}</div>
    ${trend ? `<div class="metric-trend ${trendUp ? 'up' : 'down'}">${trendUp ? '↑' : '↓'} ${trend}</div>` : ''}
  </div>`;
}

function createBadge(status) {
  const info = getStatusInfo(status);
  const cls = { listed: 'badge-warning', accepted: 'badge-info', in_transit: 'badge-info', picked: 'badge-success', processed: 'badge-success' }[status] || 'badge-neutral';
  return `<span class="badge ${cls}">${info.icon} ${info.label}</span>`;
}

function createCard(content, options = {}) {
  const { className = '', header = '', footer = '', onClick = '' } = options;
  return `<div class="card ${className}" ${onClick ? `onclick="${onClick}"` : ''}>
    ${header ? `<div class="card-header">${header}</div>` : ''}
    <div class="card-body">${content}</div>
    ${footer ? `<div class="card-footer">${footer}</div>` : ''}
  </div>`;
}

function createProgressBar(percentage, color = 'var(--color-emerald-500)') {
  return `<div class="progress-bar"><div class="progress-bar-fill" style="width: ${percentage}%; background: ${color};"></div></div>`;
}

function createTimeline(items) {
  return `<div class="timeline">${items.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot ${item.active ? 'active' : ''} ${item.completed ? 'completed' : ''}"></div>
      <div class="timeline-content">
        <div class="font-medium">${item.title}</div>
        <div class="text-sm text-muted">${item.description}</div>
      </div>
    </div>`).join('')}</div>`;
}

function createPageHeader(title, subtitle = '', actions = '') {
  return `<div class="flex justify-between items-start mb-6">
    <div><h1 class="text-2xl font-bold mb-1">${title}</h1>${subtitle ? `<p class="text-secondary">${subtitle}</p>` : ''}</div>
    ${actions ? `<div class="flex gap-3">${actions}</div>` : ''}
  </div>`;
}

function createWasteCategoryCard(category, selected = false) {
  return `<div class="card card-interactive ${selected ? 'selected-category' : ''}" 
    onclick="selectWasteCategory('${category.id}')" style="border: 2px solid ${selected ? category.color : 'transparent'};">
    <div class="card-body text-center">
      <div style="font-size: 3rem; margin-bottom: var(--space-2);">${category.icon}</div>
      <h4 class="font-semibold mb-1">${category.name}</h4>
      <p class="text-sm text-muted mb-2">${category.subcategories.slice(0, 3).join(', ')}</p>
      <span class="badge badge-neutral">${category.priceRange}</span>
    </div>
  </div>`;
}

function createCollectorPickupCard(pickup) {
  return `<div class="collector-pickup-card" onclick="viewJobDetails('${pickup.id}')">
    <div class="pickup-header">
      <div class="pickup-type">
        <div class="pickup-icon">📦</div>
        <div><div class="font-semibold">${pickup.wasteType}</div><div class="text-sm text-muted">${pickup.producer}</div></div>
      </div>
      <div style="text-align: right;"><div class="font-semibold text-success">${pickup.estimatedEarning}</div><div class="text-xs text-muted">${pickup.distance}</div></div>
    </div>
    <div class="pickup-details">
      <div class="detail-item"><div class="detail-label">Quantity</div><div class="detail-value">${pickup.estimatedQty}</div></div>
      <div class="detail-item"><div class="detail-label">Time Slot</div><div class="detail-value">${pickup.scheduledTime}</div></div>
    </div>
    <div class="text-xs text-muted mt-3 flex items-center gap-2">${getIcon('map-pin')} ${pickup.address}</div>
    ${pickup.urgency === 'high' ? '<div class="badge badge-error mt-2">Urgent</div>' : ''}
  </div>`;
}

function showModal(title, content, actions = '') {
  document.getElementById('modal-container').innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">${title}</h3><button class="modal-close" onclick="closeModal()">${getIcon('x')}</button></div>
        <div class="modal-body">${content}</div>
        ${actions ? `<div class="modal-footer">${actions}</div>` : ''}
      </div>
    </div>`;
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('modal-container').innerHTML = '';
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function createEmptyState(icon, title, message, action = '') {
  return `<div class="empty-state"><div class="empty-state-icon">${icon}</div><h3 class="empty-state-title">${title}</h3><p class="empty-state-text">${message}</p>${action}</div>`;
}

function createTable(headers, rows) {
  return `<div class="table-container"><table class="table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function createTabs(tabs, activeId) {
  return `<div class="tabs">${tabs.map(tab => `<div class="tab ${tab.id === activeId ? 'active' : ''}" onclick="switchTab('${tab.id}')">${tab.label}</div>`).join('')}</div>`;
}

function createLoader() { return '<div class="loader"></div>'; }
