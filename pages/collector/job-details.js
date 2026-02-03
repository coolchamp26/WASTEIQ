// WasteIQ - Job Details Page (Active Jobs)

function renderActiveJobs(container) {
  const data = WasteIQData.collector;

  // Robust job selection: Prioritize explicitly selected job, then active job, then nearby
  const selectedJob = WasteIQData.selectedJob ||
    (data.activeJobs && data.activeJobs.length > 0 ? data.activeJobs[0] : null) ||
    (data.nearbyPickups && data.nearbyPickups.length > 0 ? data.nearbyPickups[0] : null);

  if (!selectedJob) {
    container.innerHTML = createEmptyState('🚛', 'No Active Job', 'You have no active pickups at the moment.',
      `<button class="btn btn-primary mt-4" onclick="navigateTo('home')">Find Nearby Jobs</button>`);
    return;
  }

  container.innerHTML = `
    <div class="animate-fade-in collector-view">
      <div class="flex items-center gap-3 mb-6">
        <button class="btn btn-ghost btn-icon" onclick="navigateTo('home')">${getIcon('chevron-left')}</button>
        <h1 class="text-xl font-bold">Job Details</h1>
      </div>

      <!-- Job Card -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-bold">${selectedJob.producer}</h2>
              <div class="text-muted flex items-center gap-2 mt-1">
                ${getIcon('map-pin')} ${selectedJob.address}
              </div>
            </div>
            ${selectedJob.urgency === 'high' ? '<span class="badge badge-error">Urgent</span>' : ''}
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-slate-100/50 rounded-xl border border-slate-200">
              <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Waste Type</div>
              <div class="font-bold text-lg text-slate-800">${selectedJob.wasteType || 'N/A'}</div>
            </div>
            <div class="p-4 bg-slate-100/50 rounded-xl border border-slate-200">
              <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity</div>
              <div class="font-bold text-lg text-slate-800">${selectedJob.estimatedQty || selectedJob.quantity || '20-30 kg'}</div>
            </div>
            <div class="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <div class="text-[10px] uppercase font-bold text-sky-400 mb-1">Distance</div>
              <div class="font-bold text-lg text-sky-700">${selectedJob.distance || '1.5 km'}</div>
            </div>
            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div class="text-[10px] uppercase font-bold text-emerald-400 mb-1">Earning</div>
              <div class="font-bold text-lg text-emerald-600">${selectedJob.estimatedEarning || selectedJob.earning || '₹100-150'}</div>
            </div>
          </div>

          <!-- Time Slot -->
          <div class="p-4 bg-sky-50 rounded-xl flex items-center gap-3">
            ${getIcon('clock')}
            <div>
              <div class="text-xs text-muted">Pickup Window</div>
              <div class="font-semibold">${selectedJob.scheduledTime}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Preview -->
      <div class="card mb-6">
        <div class="card-header"><h3 class="font-semibold">Route Preview</h3></div>
        <div class="card-body p-0">
          <div class="map-container" style="height: 200px; border-radius: 0 0 var(--radius-xl) var(--radius-xl);">
            <div class="map-placeholder">
              <div class="map-placeholder-icon">🗺️</div>
              <div>${selectedJob.distance} away</div>
              <button class="btn btn-secondary btn-sm mt-2">Open in Maps</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Fixed at bottom for mobile) -->
      <div class="collector-action-buttons">
        <button class="btn btn-danger btn-xl" onclick="rejectJob('${selectedJob.id}')">
          ✕ Reject
        </button>
        <button class="btn btn-success btn-xl" onclick="acceptJob('${selectedJob.id}')">
          ✓ Accept
        </button>
      </div>

      <!-- Spacer for fixed buttons -->
      <div style="height: 100px;"></div>
    </div>
  `;
}

function acceptJob(jobId) {
  showToast('Job accepted! Navigate to pickup location.', 'success');

  // Move job to active
  const job = WasteIQData.collector.nearbyPickups.find(p => p.id === jobId);
  if (job) {
    WasteIQData.collector.activeJobs.push({
      ...job,
      status: 'accepted',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      pickupTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });
  }

  setTimeout(() => navigateTo('confirm'), 1000);
}

function rejectJob(jobId) {
  showToast('Job declined.', 'warning');
  navigateTo('home');
}
