// WasteIQ - Schedule Pickup Page

function renderSchedulePickup(container) {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  const timeSlots = [
    { id: 'morning', label: '6:00 AM - 9:00 AM', icon: '🌅' },
    { id: 'midday', label: '9:00 AM - 12:00 PM', icon: '☀️' },
    { id: 'afternoon', label: '12:00 PM - 3:00 PM', icon: '🌤️' },
    { id: 'evening', label: '3:00 PM - 6:00 PM', icon: '🌇' }
  ];

  container.innerHTML = `
    <div class="animate-fade-in flex flex-col gap-6">
    ${createPageHeader('Schedule Pickup', 'Choose a convenient date and time')}

    <div class="grid grid-cols-12 gap-6">
      <!-- Top Section: Date & Time -->
      <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date Selection -->
            <div class="card h-full shadow-sm hover:shadow-md transition-shadow">
              <div class="card-header border-b border-slate-50 flex justify-between items-center py-3">
                <h3 class="font-semibold text-slate-800">1. Select Date</h3>
                <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Availability</span>
              </div>
              <div class="card-body p-4">
                <div class="grid grid-cols-4 gap-2">
                  ${dates.map((date, i) => `
                    <button class="date-btn p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center ${i === 0 ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-slate-50 border-transparent hover:border-emerald-200'}"
                            onclick="selectDate(this, '${date.toISOString()}')" data-date="${i}">
                      <div class="text-[10px] uppercase font-semibold text-slate-500">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div class="text-xl font-bold text-slate-800 leading-none my-1">${date.getDate()}</div>
                      <div class="text-[10px] font-medium text-slate-400">${date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Time Slot Selection -->
            <div class="card h-full shadow-sm hover:shadow-md transition-shadow">
              <div class="card-header border-b border-slate-50 flex justify-between items-center py-3">
                <h3 class="font-semibold text-slate-800">2. Select Time</h3>
                <span class="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Windows</span>
              </div>
              <div class="card-body p-4 flex flex-col gap-2">
                ${timeSlots.map((slot, i) => `
                  <button class="time-btn p-3 rounded-xl border-2 transition-all flex items-center justify-between w-full ${i === 1 ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-slate-50 border-transparent hover:border-emerald-200'}"
                          onclick="selectTimeSlot(this, '${slot.id}')">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">${slot.icon}</span>
                      <div class="font-semibold text-sm text-slate-800">${slot.label}</div>
                    </div>
                    ${i === 1 ? '<span class="text-[9px] font-bold uppercase text-emerald-600">Best Match</span>' : ''}
                  </button>
                `).join('')}
              </div>
            </div>
        </div>

          <!-- Bottom Section: Location -->
          <div class="card shadow-sm">
            <div class="card-header border-b border-slate-50 py-3"><h3 class="font-semibold text-slate-800">3. Pickup Location</h3></div>
            <div class="card-body p-4 flex gap-4">
              <div class="map-container flex-shrink-0" style="height: 120px; width: 180px; border-radius: var(--radius-lg); overflow: hidden;">
                <div class="map-placeholder bg-slate-100 flex items-center justify-center">
                  <div class="text-2xl opacity-60">📍</div>
                </div>
              </div>
              <div class="flex-grow flex flex-col justify-center">
                <div class="font-semibold text-slate-800">Green Valley Apartments, Block A</div>
                <div class="text-sm text-slate-500 mb-3">Sector 15, Gurugram</div>
                <div class="form-group mb-0">
                  <input type="text" class="form-input text-xs py-2 bg-slate-50 border-slate-200" placeholder="Specific instructions (e.g. Near gate 2)">
                </div>
              </div>
            </div>
          </div>
      </div>

      <!-- Summary Sidebar -->
      <div class="col-span-12 lg:col-span-4 self-start">
        <div class="card border border-slate-200 bg-white overflow-hidden shadow-lg">
          <div class="p-6 bg-slate-900 text-white">
            <h3 class="font-bold text-lg leading-tight">Booking Summary</h3>
            <p class="text-slate-400 text-xs mt-1">Review your collection details</p>
          </div>
          <div class="card-body p-6 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Scheduled Date</span>
                <span class="font-semibold text-lg text-slate-800" id="selected-date">${today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </div>
              <div class="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center text-xl">📅</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pickup Window</span>
                <span class="font-semibold text-lg text-slate-800" id="selected-time">9:00 AM - 12:00 PM</span>
              </div>
              <div class="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center text-xl">⏰</div>
            </div>
            
            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p class="text-xs text-emerald-800 leading-relaxed font-medium">Automatic collector assignment will proceed after confirmation.</p>
              </div>
            </div>
          </div>
          <div class="p-6 pt-0">
            <button class="btn btn-primary btn-block btn-lg shadow-emerald-200 hover:shadow-lg transition-all" onclick="confirmSchedule()">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function selectDate(btn, dateStr) {
  document.querySelectorAll('.date-btn').forEach(b => {
    b.classList.remove('bg-emerald-50', 'border-emerald-500');
    b.classList.add('bg-slate-50');
    b.style.borderColor = 'transparent';
  });
  btn.classList.remove('bg-slate-50');
  btn.classList.add('bg-emerald-50', 'border-emerald-500');

  const date = new Date(dateStr);
  document.getElementById('selected-date').textContent = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function selectTimeSlot(btn, slotId) {
  document.querySelectorAll('.time-btn').forEach(b => {
    b.classList.remove('bg-emerald-50', 'border-emerald-500');
    b.classList.add('bg-slate-50');
    b.style.borderColor = 'transparent';
  });
  btn.classList.remove('bg-slate-50');
  btn.classList.add('bg-emerald-50', 'border-emerald-500');

  document.getElementById('selected-time').textContent = btn.querySelector('.font-semibold').textContent;
}

function confirmSchedule() {
  showToast('Pickup scheduled successfully!', 'success');
  setTimeout(() => navigateTo('tracking'), 1500);
}
