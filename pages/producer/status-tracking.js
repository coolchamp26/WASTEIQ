// WasteIQ - Status Tracking Page

async function renderStatusTracking(container) {
  const userId = document.body.getAttribute('data-user-id');

  console.log('[Tracking] Initializing for User:', userId);

  // Refresh data from backend
  if (userId) {
    showToast('Updating tracking status...', 'info');
    await BackendService.fetchDashboardData('producer', userId);
  }

  const data = WasteIQData.producer;

  // Defensive check: Ensure arrays exist
  if (!data.activePickups) data.activePickups = [];
  if (!data.history) data.history = [];

  console.log('[Tracking] Data Ready:', data.activePickups.length, 'active,', data.history.length, 'history');

  container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('Track Pickups', 'Monitor your waste collection status')}
      
      <div class="mb-6">
        ${createTabs([
    { id: 'active', label: 'Active (' + data.activePickups.length + ')' },
    { id: 'history', label: 'History (' + data.history.length + ')' }
  ], 'active')}
      </div>

      <div id="tab-active" class="tab-content active">
        ${data.activePickups.length > 0 ? `
          <div class="space-y-4">
            ${data.activePickups.map(pickup => renderPickupCard(pickup)).join('')}
          </div>
        ` : createEmptyState('📦', 'No Active Pickups', 'Create a waste listing to get started.',
    '<button class="btn btn-primary" onclick="navigateTo(\'list-waste\')">List Waste</button>')}
      </div>

      <div id="tab-history" class="tab-content">
        <div class="card">
          <div class="card-body p-0">
            ${createTable(
      ['ID', 'Waste Type', 'Quantity', 'Date', 'Status', 'Earned'],
      data.history.map(h => [
        `<span class="text-muted">#${h.id}</span>`,
        h.waste,
        h.qty,
        formatDate(h.date),
        createBadge(h.status),
        `<span class="text-success font-medium">${h.earnings}</span>`
      ])
    )}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPickupCard(pickup) {
  const statusSteps = [
    { id: 'listed', title: 'Listed', description: 'Waste listing created' },
    { id: 'accepted', title: 'Accepted', description: 'Collector assigned' },
    { id: 'picked', title: 'Picked Up', description: 'Waste collected' },
    { id: 'processed', title: 'Processed', description: 'Recovery complete' }
  ];

  const currentIndex = statusSteps.findIndex(s => s.id === pickup.status);

  return `
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-2xl">${getWasteCategory(pickup.waste)?.icon || '📦'}</span>
          <div>
            <h4 class="font-semibold">${getWasteCategory(pickup.waste)?.name || pickup.waste}</h4>
            <span class="text-sm text-muted">#${pickup.id}</span>
          </div>
        </div>
        ${createBadge(pickup.status)}
      </div>
      <div class="card-body">
        <!-- Status Timeline -->
        <div class="flex items-center justify-between mb-6">
          ${statusSteps.map((step, i) => `
            <div class="flex-1 relative">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold ${i <= currentIndex ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
    }">
                  ${i <= currentIndex ? '✓' : i + 1}
                </div>
                <div class="text-xs font-medium mt-2 ${i <= currentIndex ? 'text-emerald-600' : 'text-slate-400'}">${step.title}</div>
              </div>
              ${i < statusSteps.length - 1 ? `
                <div class="absolute top-5 left-1/2 w-full h-0.5 ${i < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'}"></div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Pickup Details -->
        <div class="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
          <div>
            <div class="text-xs text-muted mb-1">Items</div>
            <div class="font-medium">${pickup.subcategories?.join(', ') || 'Mixed'}</div>
          </div>
          <div>
            <div class="text-xs text-muted mb-1">Quantity</div>
            <div class="font-medium">${pickup.quantity}</div>
          </div>
          <div>
            <div class="text-xs text-muted mb-1">Scheduled</div>
            <div class="font-medium">${formatDate(pickup.scheduledDate)}</div>
          </div>
          <div>
            <div class="text-xs text-muted mb-1">Time Slot</div>
            <div class="font-medium">${pickup.scheduledTime}</div>
          </div>
        </div>

        ${pickup.collector ? `
          <!-- Collector Info -->
          <div class="mt-4 p-4 border border-slate-200 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar">${pickup.collector.name.charAt(0)}</div>
              <div>
                <div class="font-medium">${pickup.collector.name}</div>
                <div class="text-sm text-muted flex items-center gap-1">
                  <span style="color: #f59e0b;">★</span> ${pickup.collector.rating} rating
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-secondary btn-icon" title="Call">
                ${getIcon('phone')}
              </button>
              <button class="btn btn-primary" onclick="showPickupDetails('${pickup.id}')">
                View Details
              </button>
            </div>
          </div>
        ` : `
          <div class="mt-4 p-4 bg-amber-50 rounded-xl text-center">
            <div class="text-amber-700">Matching with nearby collectors...</div>
            <div class="loader mx-auto mt-2" style="width: 24px; height: 24px; border-width: 2px;"></div>
          </div>
        `}
      </div>
    </div>
  `;
}

function showPickupDetails(pickupId) {
  const pickup = WasteIQData.producer.activePickups.find(p => p.id === pickupId);
  if (!pickup) return;

  showModal('Pickup Details', `
    <div class="space-y-4">
      <div class="flex justify-between"><span class="text-muted">Pickup ID</span><span class="font-medium">#${pickup.id}</span></div>
      <div class="flex justify-between"><span class="text-muted">Waste Type</span><span class="font-medium">${pickup.waste}</span></div>
      <div class="flex justify-between"><span class="text-muted">Quantity</span><span class="font-medium">${pickup.quantity}</span></div>
      <div class="flex justify-between"><span class="text-muted">Status</span>${createBadge(pickup.status)}</div>
      ${pickup.collector ? `
        <hr>
        <div class="flex justify-between"><span class="text-muted">Collector</span><span class="font-medium">${pickup.collector.name}</span></div>
        <div class="flex justify-between"><span class="text-muted">Contact</span><span class="font-medium">${pickup.collector.phone}</span></div>
      ` : ''}
    </div>
  `, '<button class="btn btn-secondary" onclick="closeModal()">Close</button>');
}

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const tabIndex = tabId === 'active' ? 1 : 2;
  const tabEl = document.querySelector(`.tab:nth-child(${tabIndex})`);
  if (tabEl) tabEl.classList.add('active');

  const contentEl = document.getElementById(`tab-${tabId}`);
  if (contentEl) contentEl.classList.add('active');
}
