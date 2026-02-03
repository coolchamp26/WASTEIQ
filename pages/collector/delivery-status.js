// WasteIQ - Delivery Status / Earnings Page

function renderDeliveryStatus(container) {
    const data = WasteIQData.collector;

    container.innerHTML = `
    <div class="animate-fade-in collector-view">
      ${createPageHeader('Earnings', 'Track your income and completed pickups')}

      <!-- Earnings Overview -->
      <div class="card mb-6" style="background: linear-gradient(135deg, var(--color-sky-500), var(--color-sky-600)); color: white;">
        <div class="card-body text-center">
          <div class="text-sm opacity-80 mb-1">Total Earnings This Week</div>
          <div class="text-4xl font-bold mb-2">${formatCurrency(data.earnings.week)}</div>
          <div class="flex justify-center gap-6 mt-4">
            <div>
              <div class="text-2xl font-semibold">${formatCurrency(data.earnings.today)}</div>
              <div class="text-xs opacity-80">Today</div>
            </div>
            <div class="w-px bg-white opacity-30"></div>
            <div>
              <div class="text-2xl font-semibold">${formatCurrency(data.earnings.month)}</div>
              <div class="text-xs opacity-80">This Month</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="card text-center">
          <div class="card-body">
            <div class="text-2xl font-bold text-primary">${data.profile.completedPickups}</div>
            <div class="text-xs text-muted">Total Pickups</div>
          </div>
        </div>
        <div class="card text-center">
          <div class="card-body">
            <div class="text-2xl font-bold text-amber-500">⭐ ${data.profile.rating}</div>
            <div class="text-xs text-muted">Rating</div>
          </div>
        </div>
        <div class="card text-center">
          <div class="card-body">
            <div class="text-2xl font-bold text-success">${formatCurrency(data.earnings.pending)}</div>
            <div class="text-xs text-muted">Pending</div>
          </div>
        </div>
      </div>

      <!-- Today's Completed -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold">Today's Pickups</h3>
        <span class="badge badge-success">${data.completedToday.length} completed</span>
      </div>

      <div class="card mb-6">
        <div class="card-body p-0">
          <ul class="list">
            ${data.completedToday.map(pickup => `
              <li class="list-item flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="avatar-sm" style="background: var(--color-emerald-100); color: var(--color-emerald-600);">✓</div>
                  <div>
                    <div class="font-medium">${pickup.producer}</div>
                    <div class="text-sm text-muted">${pickup.wasteType} • ${pickup.qty}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-success">${pickup.earning}</div>
                  <div class="text-xs text-muted">${pickup.time}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Delivery Completion Form (if active job just completed) -->
      ${WasteIQData.collector.activeJobs[0]?.status === 'picked' ? `
        <div class="card" style="border: 2px solid var(--color-emerald-500);">
          <div class="card-header bg-emerald-50">
            <h3 class="font-semibold text-emerald-700">Complete Delivery</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Actual Weight (kg)</label>
              <input type="number" class="form-input form-input-lg" id="actual-weight" placeholder="Enter weight">
            </div>
            <div class="form-group">
              <label class="form-label">Recovery Outcome</label>
              <select class="form-input form-select" id="recovery-outcome">
                <option value="recycled">Sent for Recycling</option>
                <option value="composted">Sent for Composting</option>
                <option value="reused">Direct Reuse</option>
                <option value="landfill">Landfill (last resort)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notes (Optional)</label>
              <textarea class="form-input form-textarea" id="delivery-notes" placeholder="Any additional notes"></textarea>
            </div>
            <button class="btn btn-success btn-block btn-lg" onclick="completeDelivery()">
              ${getIcon('check')} Mark as Delivered
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function completeDelivery() {
    const weight = document.getElementById('actual-weight')?.value;
    const outcome = document.getElementById('recovery-outcome')?.value;

    if (!weight) {
        showToast('Please enter the actual weight', 'warning');
        return;
    }

    showToast('Delivery completed! Earnings updated.', 'success');

    // Clear active job
    WasteIQData.collector.activeJobs = [];

    // Add to completed
    WasteIQData.collector.completedToday.unshift({
        id: 'PU' + Date.now(),
        producer: 'Recent Pickup',
        wasteType: 'Mixed',
        qty: weight + ' kg',
        earning: formatCurrency(parseInt(weight) * 6),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });

    setTimeout(() => navigateTo('home'), 1500);
}
