// WasteIQ - Main Application Logic

// Global State
let currentRole = null;
let currentPage = null;

// Check Protocol (Common issue for beginners)
if (window.location.protocol === 'file:') {
  console.warn('WasteIQ: Running from file protocol. API calls will fail.');
  window.addEventListener('DOMContentLoaded', () => {
    showToast('Warning: Running from a file. Use http://localhost:3000 for backend features.', 'error');
  });
}

// Expose key functions to window for HTML access
window.enterApp = enterApp;
window.showLanding = showLanding;
window.navigateTo = navigateTo;

// ===================
// SCREEN MANAGEMENT
// ===================

// ===================
// SCREEN MANAGEMENT
// ===================

function showLanding() {
  const landing = document.getElementById('landing-screen');
  const app = document.getElementById('app-shell');

  if (landing) landing.classList.remove('hidden');
  if (app) app.classList.add('hidden');

  showLoginScreen();

  currentRole = null;
  currentPage = null;
}

window.showLoginScreen = function (event) {
  if (event) event.preventDefault();
  document.getElementById('login-form').parentElement.parentElement.classList.remove('hidden');
  document.getElementById('registration-container').classList.add('hidden');
}

window.showRegistrationScreen = function (event) {
  if (event) event.preventDefault();
  document.getElementById('login-form').parentElement.parentElement.classList.add('hidden');
  document.getElementById('registration-container').classList.remove('hidden');
}

// Helper for Demo Login
window.fillLogin = function (email) {
  document.getElementById('email').value = email;
}

window.handleLogin = async function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('login-btn');

  // Loading state
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="loader" style="width:20px;height:20px;border-width:2px;margin:0 auto"></div>';
  btn.disabled = true;

  try {
    const apiBase = window.location.origin;
    const response = await fetch(`${apiBase}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Store full user data in WasteIQData before entering
      const profile = data.user;
      if (profile.role === 'producer') Object.assign(WasteIQData.producer.profile, profile);
      if (profile.role === 'collector') Object.assign(WasteIQData.collector.profile, profile);
      if (profile.role === 'admin') Object.assign(WasteIQData.admin.profile, profile);

      enterApp(data.user.role, data.user.id);
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Login Error:', error);
    showToast(`Login error: ${error.message}`, 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

window.handleRegister = async function (event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;
  const btn = event.submitter || document.querySelector('#registration-form button[type="submit"]');

  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="loader" style="width:20px;height:20px;border-width:2px;margin:0 auto"></div>';
  btn.disabled = true;

  try {
    const apiBase = window.location.origin;
    const response = await fetch(`${apiBase}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Registration failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      showToast('Account created! Logging you in...', 'success');

      const profile = data.user;
      if (profile.role === 'producer') Object.assign(WasteIQData.producer.profile, profile);
      if (profile.role === 'collector') Object.assign(WasteIQData.collector.profile, profile);
      if (profile.role === 'admin') Object.assign(WasteIQData.admin.profile, profile);

      setTimeout(() => enterApp(data.user.role, data.user.id), 1000);
    } else {
      showToast(data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Registration Error:', error);
    showToast(`Registration error: ${error.message}`, 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function enterApp(role, userId) {
  console.log('[App] Entering as:', role, 'ID:', userId);
  showToast(`Syncing data for ${role}...`, 'info');

  try {
    // 1. Sync Data from Backend
    if (userId) {
      await BackendService.fetchDashboardData(role, userId);
      console.log('[App] Initial Sync Complete');
    }

    // 3. Screen Management
    const landing = document.getElementById('landing-screen');
    const app = document.getElementById('app-shell');

    // 4. Update State
    currentRole = role;

    // 5. Update UI (with safety checks)
    if (landing) landing.classList.add('hidden');
    if (app) app.classList.remove('hidden');

    document.body.setAttribute('data-user-id', userId || '');
    document.body.setAttribute('data-role', role);

    updateRoleUI(role);
    buildNavigation(role);

    // 6. Navigate
    const defaultPages = { producer: 'dashboard', collector: 'home', admin: 'dashboard' };
    const targetPage = defaultPages[role] || 'dashboard';

    console.log(`Navigating to ${targetPage} for role ${role}`);
    navigateTo(targetPage);

    showToast(`Welcome to WasteIQ ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard!`, 'success');
  } catch (error) {
    console.error('CRITICAL ERROR in enterApp:', error);
    alert(`System Error: ${error.message}`);

    // Fallback: Show error on screen if possible
    const app = document.getElementById('app-shell');
    if (app) {
      app.classList.remove('hidden');
      document.getElementById('main-content').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>System Error</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
        </div>
      `;
    }
  }
}

function updateRoleUI(role) {
  const sidebarRole = document.getElementById('sidebar-role');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');

  const roleNames = { producer: 'Producer', collector: 'Collector', admin: 'Administrator' };
  const roleData = {
    producer: WasteIQData?.producer?.profile,
    collector: WasteIQData?.collector?.profile,
    admin: WasteIQData?.admin?.profile
  };

  const profile = roleData[role];

  if (sidebarRole) sidebarRole.textContent = roleNames[role] || role;
  if (userAvatar) {
    userAvatar.textContent = profile?.name?.charAt(0) || 'U';
    userAvatar.className = `avatar ${role}`; // Set role-based color class
  }
  if (userName) userName.textContent = profile?.name || 'User';
}

function handleLogout() {
  showToast('Logged out successfully', 'success');
  setTimeout(() => showLanding(), 500);
}

// ===================
// NAVIGATION
// ===================

function buildNavigation(role) {
  const navConfig = WasteIQData?.navigation?.[role] || [];
  const sidebarNav = document.getElementById('sidebar-nav-list');
  const mobileNav = document.getElementById('mobile-nav-list');

  if (sidebarNav) {
    sidebarNav.innerHTML = navConfig.map(item => `
      <li class="sidebar-nav-item">
        <a href="#" class="sidebar-nav-link" data-page="${item.id}" onclick="navigateTo('${item.id}'); return false;">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      </li>
    `).join('');
  }

  if (mobileNav) {
    const mobileItems = navConfig.slice(0, 4);
    mobileNav.innerHTML = mobileItems.map(item => `
      <li class="mobile-nav-item">
        <a href="#" class="mobile-nav-link" data-page="${item.id}" onclick="navigateTo('${item.id}'); return false;">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      </li>
    `).join('');
  }
}

function navigateTo(pageId) {
  if (!currentRole) return;
  console.log('[Navigation] ->', pageId);

  currentPage = pageId;

  // Update active state
  document.querySelectorAll('.sidebar-nav-link, .mobile-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Show loading
  mainContent.innerHTML = '<div class="flex items-center justify-center" style="height:300px"><div class="loader"></div></div>';

  // Render page
  setTimeout(() => renderPage(currentRole, pageId, mainContent), 100);

  closeMobileSidebar();
}

function renderPage(role, pageId, container) {
  const pageRenderers = {
    producer: {
      dashboard: typeof renderProducerDashboard === 'function' ? renderProducerDashboard : null,
      'list-waste': typeof renderWasteListing === 'function' ? renderWasteListing : null,
      schedule: typeof renderSchedulePickup === 'function' ? renderSchedulePickup : null,
      tracking: typeof renderStatusTracking === 'function' ? renderStatusTracking : null
    },
    collector: {
      home: window.renderCollectorHome || (typeof renderCollectorHome === 'function' ? renderCollectorHome : null),
      active: window.renderActiveJobs || (typeof renderActiveJobs === 'function' ? renderActiveJobs : null),
      confirm: window.renderPickupConfirmation || (typeof renderPickupConfirmation === 'function' ? renderPickupConfirmation : null),
      earnings: window.renderDeliveryStatus || (typeof renderDeliveryStatus === 'function' ? renderDeliveryStatus : null)
    },
    admin: {
      dashboard: typeof renderAdminDashboard === 'function' ? renderAdminDashboard : null,
      heatmaps: typeof renderHeatmaps === 'function' ? renderHeatmaps : null,
      'material-flow': typeof renderMaterialFlow === 'function' ? renderMaterialFlow : null,
      analytics: typeof renderAnalytics === 'function' ? renderAnalytics : null
    }
  };

  const rolePages = pageRenderers[role];
  const renderer = rolePages ? rolePages[pageId] : null;

  if (renderer) {
    try {
      renderer(container);
    } catch (error) {
      console.error('Page render error:', error);
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error Loading Page</h3><p>${error.message}</p></div>`;
    }
  } else {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Page Not Found</h3><p>The page "${pageId}" is not available.</p></div>`;
  }
}

// ===================
// MOBILE SIDEBAR
// ===================

function toggleMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('hidden');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.add('hidden');
}

// ===================
// DARK MODE
// ===================

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('wasteiq-theme', isDark ? 'light' : 'dark');

  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';

  showToast(`${isDark ? 'Light' : 'Dark'} mode enabled`, 'success');
}

function toggleNotifications() {
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.style.display = 'none';
  }
  showToast('You have 3 new notifications', 'info');
}

// ===================
// UTILITIES
// ===================

// showToast is imported from components.js

function showModal(title, content, footer = '') {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal animate-scale-in" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="btn btn-ghost btn-icon" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>
  `;
}

function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}

// ===================
// INITIALIZATION
// ===================

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  const savedTheme = localStorage.getItem('wasteiq-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  // Show landing page
  showLanding();

  // Role listeners are already handled by inline onclick in index.html
  console.log('WasteIQ initialized - Ready');
});
