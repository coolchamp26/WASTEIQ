// WasteIQ - Pickup Confirmation Page

function renderPickupConfirmation(container) {
  const data = WasteIQData.collector;
  const activeJob = data.activeJobs[0];

  if (!activeJob) {
    container.innerHTML = createEmptyState('📦', 'No Active Job', 'Accept a job to start pickup confirmation.',
      '<button class="btn btn-collector" onclick="navigateTo(\'home\')">Find Jobs</button>');
    return;
  }

  container.innerHTML = `
    <div class="animate-fade-in collector-view">
      <div class="flex items-center gap-3 mb-6">
        <button class="btn btn-ghost btn-icon" onclick="navigateTo('home')">${getIcon('chevron-left')}</button>
        <h1 class="text-xl font-bold">Confirm Pickup</h1>
      </div>

      <!-- Job Summary -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="flex items-center gap-4">
            <div class="avatar-lg" style="background: linear-gradient(135deg, var(--color-sky-400), var(--color-sky-500));">
              ${activeJob.producer.charAt(0)}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold">${activeJob.producer}</h3>
              <div class="text-sm text-muted">${activeJob.wasteType} • ${activeJob.quantity}</div>
            </div>
            <span class="badge badge-info">${activeJob.status === 'in_transit' ? 'In Transit' : 'Accepted'}</span>
          </div>
        </div>
      </div>

      <!-- OTP Entry -->
      <div class="card mb-6">
        <div class="card-header text-center">
          <h3 class="font-semibold">Enter Verification Code</h3>
          <p class="text-sm text-muted mt-1">Ask the producer for the 4-digit OTP</p>
        </div>
        <div class="card-body">
          <div class="otp-input-group mb-4">
            <input type="text" class="otp-input" maxlength="1" id="otp1" oninput="handleOTPInput(this, 'otp2')" autofocus>
            <input type="text" class="otp-input" maxlength="1" id="otp2" oninput="handleOTPInput(this, 'otp3')">
            <input type="text" class="otp-input" maxlength="1" id="otp3" oninput="handleOTPInput(this, 'otp4')">
            <input type="text" class="otp-input" maxlength="1" id="otp4" oninput="handleOTPInput(this, null)">
          </div>
          <button class="btn btn-collector btn-block btn-lg" onclick="verifyOTP()">
            ${getIcon('check-circle')} Verify & Confirm Pickup
          </button>
        </div>
      </div>

      <!-- OR Divider -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1 h-px bg-slate-200"></div>
        <span class="text-muted text-sm">OR</span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- QR Scan Option -->
      <div class="card mb-6">
        <div class="card-body text-center">
          <div class="text-4xl mb-3">📷</div>
          <h4 class="font-semibold mb-2">Scan QR Code</h4>
          <p class="text-sm text-muted mb-4">Ask the producer to show their pickup QR code</p>
          <button class="btn btn-secondary btn-block" onclick="simulateQRScan()">
            Open Camera
          </button>
        </div>
      </div>

      <!-- Producer Contact -->
      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <div class="text-sm text-muted">Need help?</div>
            <div class="font-medium">Contact Producer</div>
          </div>
          <button class="btn btn-secondary btn-icon">
            ${getIcon('phone')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleOTPInput(current, nextId) {
  if (current.value.length === 1 && nextId) {
    document.getElementById(nextId).focus();
  }

  // Check if all OTP fields are filled
  const otp = ['otp1', 'otp2', 'otp3', 'otp4'].map(id => document.getElementById(id).value).join('');
  if (otp.length === 4) {
    verifyOTP();
  }
}

async function verifyOTP() {
  const otp = ['otp1', 'otp2', 'otp3', 'otp4'].map(id => document.getElementById(id)?.value || '').join('');
  const userId = document.body.getAttribute('data-user-id');
  const activeJob = WasteIQData.collector.activeJobs[0];

  if (!activeJob) return;

  // In a real app, we would verify the OTP against the database
  // For this demo, any 4-digit OTP works, but it triggers a real status change
  if (otp.length === 4) {
    try {
      const result = await BackendService.completePickup(activeJob.id, userId);
      if (result.success) {
        showToast('Pickup confirmed successfully!', 'success');
        setTimeout(() => navigateTo('earnings'), 1000);
      } else {
        showToast(result.error || 'Failed to complete pickup', 'error');
      }
    } catch (err) {
      console.error('OTP Verification Error:', err);
      showToast('Connection error', 'error');
    }
  } else {
    showToast('Please enter complete OTP', 'warning');
  }
}

function simulateQRScan() {
  showModal('QR Scanner', `
    <div class="text-center p-4">
      <div class="text-6xl mb-4">📷</div>
      <p class="text-muted mb-4">Camera simulation - In production, this would open device camera</p>
      <div class="loader mx-auto mb-4"></div>
      <p class="text-sm">Scanning...</p>
    </div>
  `);

  setTimeout(() => {
    closeModal();
    showToast('QR Code verified!', 'success');
    setTimeout(() => navigateTo('earnings'), 1000);
  }, 2000);
}
