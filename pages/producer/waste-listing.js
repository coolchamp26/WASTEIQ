// WasteIQ - Waste Listing Page

let selectedCategory = null;
let selectedQuantity = null;
let selectedSubcategories = [];

function renderWasteListing(container) {
  const categories = WasteIQData.wasteCategories;

  container.innerHTML = `
    <div class="animate-fade-in">
      ${createPageHeader('List Waste', 'Select waste type and quantity for pickup')}
      
      <!-- Step Indicator -->
      <div class="flex items-center gap-4 mb-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">1</div>
          <span class="font-medium">Select Type</span>
        </div>
        <div class="h-px flex-1 bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-semibold" id="step2">2</div>
          <span class="text-muted">Quantity</span>
        </div>
        <div class="h-px flex-1 bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-semibold" id="step3">3</div>
          <span class="text-muted">Confirm</span>
        </div>
      </div>

      <!-- Category Selection -->
      <div id="category-section">
        <h3 class="font-semibold mb-4">What type of waste do you have?</h3>
        <div class="grid grid-cols-4 gap-4 mb-6">
          ${categories.map(cat => createWasteCategoryCard(cat, selectedCategory === cat.id)).join('')}
        </div>
      </div>

      <!-- Subcategory Selection (shown after category selected) -->
      <div id="subcategory-section" class="hidden mb-6">
        <h3 class="font-semibold mb-4">Select specific items</h3>
        <div id="subcategory-list" class="flex flex-wrap gap-2"></div>
      </div>

      <!-- Quantity Selection -->
      <div id="quantity-section" class="hidden mb-6">
        <h3 class="font-semibold mb-4">Estimated quantity</h3>
        <div class="grid grid-cols-5 gap-3">
          ${WasteIQData.quantityRanges.map(range => `
            <button class="btn btn-secondary quantity-btn ${selectedQuantity === range.id ? 'btn-primary' : ''}" 
                    onclick="selectQuantity('${range.id}')" data-qty="${range.id}">
              ${range.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Additional Details -->
      <div id="details-section" class="hidden mb-6">
        <h3 class="font-semibold mb-4">Additional Details</h3>
        <div class="card">
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Special Instructions (Optional)</label>
              <textarea class="form-input form-textarea" id="special-instructions" 
                        placeholder="Any specific handling requirements, access instructions, etc."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Pickup Location</label>
              <select class="form-input form-select" id="pickup-location">
                <option value="gate">Main Gate</option>
                <option value="basement">Basement Parking</option>
                <option value="backyard">Back Entrance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary & Actions -->
      <div id="summary-section" class="hidden">
        <div class="card" style="border: 2px solid var(--color-emerald-500);">
          <div class="card-header bg-emerald-50">
            <h3 class="font-semibold text-emerald-700">Listing Summary</h3>
          </div>
          <div class="card-body">
            <div id="summary-content"></div>
          </div>
          <div class="card-footer flex justify-between">
            <button class="btn btn-secondary" onclick="resetListing()">Reset</button>
            <button class="btn btn-primary" onclick="submitListing()">
              ${getIcon('check')} Create Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectWasteCategory(categoryId) {
  selectedCategory = categoryId;
  const category = getWasteCategory(categoryId);

  // Update UI
  document.querySelectorAll('.card-interactive').forEach(card => {
    card.style.borderColor = 'transparent';
  });
  event.currentTarget.style.borderColor = category.color;

  // Show subcategories
  const subSection = document.getElementById('subcategory-section');
  subSection.classList.remove('hidden');
  document.getElementById('subcategory-list').innerHTML = category.subcategories.map(sub => `
    <button class="btn btn-secondary subcategory-btn" onclick="toggleSubcategory(this, '${sub}')">${sub}</button>
  `).join('');

  // Show quantity section
  document.getElementById('quantity-section').classList.remove('hidden');
  document.getElementById('step2').classList.replace('bg-slate-200', 'bg-emerald-500');
  document.getElementById('step2').classList.replace('text-slate-500', 'text-white');

  updateSummary();
}

function toggleSubcategory(btn, subcategory) {
  btn.classList.toggle('btn-primary');
  btn.classList.toggle('btn-secondary');
  if (selectedSubcategories.includes(subcategory)) {
    selectedSubcategories = selectedSubcategories.filter(s => s !== subcategory);
  } else {
    selectedSubcategories.push(subcategory);
  }
  updateSummary();
}

function selectQuantity(quantityId) {
  selectedQuantity = quantityId;
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.classList.toggle('btn-primary', btn.dataset.qty === quantityId);
    btn.classList.toggle('btn-secondary', btn.dataset.qty !== quantityId);
  });

  // Show details section
  document.getElementById('details-section').classList.remove('hidden');
  document.getElementById('step3').classList.replace('bg-slate-200', 'bg-emerald-500');
  document.getElementById('step3').classList.replace('text-slate-500', 'text-white');

  updateSummary();
}

function updateSummary() {
  if (selectedCategory && selectedQuantity) {
    const category = getWasteCategory(selectedCategory);
    const quantity = WasteIQData.quantityRanges.find(q => q.id === selectedQuantity);

    document.getElementById('summary-section').classList.remove('hidden');
    document.getElementById('summary-content').innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div><span class="text-muted">Waste Type:</span><div class="font-semibold">${category.icon} ${category.name}</div></div>
        <div><span class="text-muted">Recovery Path:</span><div class="font-semibold capitalize">${category.recoveryPath}</div></div>
        <div><span class="text-muted">Quantity:</span><div class="font-semibold">${quantity.label}</div></div>
        <div><span class="text-muted">Items:</span><div class="font-semibold">${selectedSubcategories.length > 0 ? selectedSubcategories.join(', ') : 'All types'}</div></div>
      </div>
      <div class="mt-4 p-3 bg-emerald-50 rounded-lg">
        <div class="text-sm text-emerald-700">
          <strong>Estimated Value:</strong> ${category.priceRange}
        </div>
      </div>
    `;
  }
}

function resetListing() {
  selectedCategory = null;
  selectedQuantity = null;
  selectedSubcategories = [];
  renderWasteListing(document.getElementById('main-content'));
}

async function submitListing() {
  const submitBtn = document.querySelector('#summary-section .btn-primary');
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = createLoader();
  submitBtn.disabled = true;

  try {
    const category = getWasteCategory(selectedCategory);
    const quantity = WasteIQData.quantityRanges.find(q => q.id === selectedQuantity);

    const producerId = document.body.getAttribute('data-user-id');

    const listingData = {
      producerId: producerId,
      wasteType: selectedCategory, // Use the ID for DB reference
      categoryName: category.name,
      subcategories: selectedSubcategories,
      quantityLabel: quantity.label,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: 'Flexible'
    };

    const result = await BackendService.createListing(listingData);

    if (result.success) {
      showToast('Waste listing created successfully! Stored in DB', 'success');
      setTimeout(() => navigateTo('tracking'), 1000);
    } else {
      throw new Error(result.error || 'Failed to create listing');
    }
  } catch (error) {
    console.error('Listing failed', error);
    showToast('Failed to create listing: ' + error.message, 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}
