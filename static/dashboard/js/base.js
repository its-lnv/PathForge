/* ── TOAST ──────────────────────────────────────────────────────────────
   showToast('Your message', '✅')
   ─────────────────────────────────────────────────────────────────── */
function showToast(msg, icon = '✓') {
  const el = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');
  if (!el || !msgEl || !iconEl) return;
  msgEl.textContent  = msg;
  iconEl.textContent = icon;
  el.classList.add('show');
  clearTimeout(el._tid);
  el._tid = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── LIGHT / DARK MODE ──────────────────────────────────────────────────
   Toggles data-theme on <html>. Persists in sessionStorage.
   ─────────────────────────────────────────────────────────────────── */
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { sessionStorage.setItem('nx-mode', next); } catch(_) {}
  showToast(next === 'light' ? 'Light mode on' : 'Dark mode on', next === 'light' ? '☀️' : '🌙');
}

/* Restore saved light/dark preference */
(function restoreMode() {
  try {
    const saved = sessionStorage.getItem('nx-mode');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch(_) {}
})();

/* ── SIDEBAR (mobile) ───────────────────────────────────────────────── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SIDEBAR NAV ────────────────────────────────────────────────────────
   Usage: onclick="sideNav(this)"  or  sideNav(el, '#section-id')
   ─────────────────────────────────────────────────────────────────── */
function sideNav(el, scrollTarget) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  if (scrollTarget) {
    const t = document.querySelector(scrollTarget);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  }
  closeSidebar();
}

/* ── ACCENT THEME SWITCHER ──────────────────────────────────────────────
   Usage: setAccentTheme('default'|'fire'|'digital', optionalEl)
   ─────────────────────────────────────────────────────────────────── */
function setAccentTheme(theme, el) {
  const names = { default: 'Digital Green', fire: 'Fiery Orange', digital: 'Electric Blue' };
  const stripped = document.body.className.replace(/theme-\S+/g, '').trim();
  document.body.className = (stripped + (theme !== 'default' ? ` theme-${theme}` : '')).trim();
  if (el) {
    document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
  }
  showToast(`Accent: ${names[theme] || theme}`, '🎨');
  try { sessionStorage.setItem('nx-accent', theme); } catch(_) {}
}

/* Restore saved accent theme */
(function restoreAccent() {
  try {
    const saved = sessionStorage.getItem('nx-accent');
    if (saved && saved !== 'default') document.body.classList.add(`theme-${saved}`);
  } catch(_) {}
})();

/* ── AVATAR UPLOAD ──────────────────────────────────────────────────────
   Attach to: <input type="file" accept="image/*" onchange="uploadAvatar(this)">
   Updates sidebar mini-avatar, topbar greeting avatar, and main profile avatar.
   ─────────────────────────────────────────────────────────────────── */
function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    // Sidebar
    const sbImg = document.getElementById('sbAvatarImg');
    if (sbImg) { sbImg.src = src; sbImg.style.display = 'block'; }
    // Topbar greeting
    const gImg = document.getElementById('greetingAvatarImg');
    if (gImg) {
      gImg.src = src; gImg.style.display = 'block';
      const gAvatar = document.getElementById('greetingAvatar');
      if (gAvatar) gAvatar.style.fontSize = '0';
    }
    // Main profile avatar (if present on page)
    const mainImg = document.getElementById('mainAvatarImg');
    if (mainImg) { mainImg.src = src; mainImg.style.display = 'block'; }
    showToast('Profile photo updated!', '📷');
  };
  reader.readAsDataURL(file);
}

/* ── GREETING NAME SYNC ─────────────────────────────────────────────────
   Call after saving a profile name update: syncGreeting('Arjun Sharma')
   ─────────────────────────────────────────────────────────────────── */
function syncGreeting(fullName) {
  const first = fullName ? fullName.trim().split(' ')[0] : 'Student';
  const gEl = document.getElementById('greetingName');
  if (gEl) gEl.textContent = first;
  const sbEl = document.getElementById('sbUserName');
  if (sbEl) sbEl.textContent = fullName;
}

/* ── MODAL HELPERS ──────────────────────────────────────────────────────
   openModal('myModalId')  /  closeModal('myModalId')
   ─────────────────────────────────────────────────────────────────── */
function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('open');    }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }

/* Close modals on backdrop click */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

/* Escape key: close sidebar + any open modal */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

/* ── TOGGLE SWITCH FEEDBACK ─────────────────────────────────────────── */
document.querySelectorAll('.toggle input').forEach(toggle => {
  toggle.addEventListener('change', () => {
    showToast(toggle.checked ? 'Setting enabled' : 'Setting disabled', toggle.checked ? '✅' : '○');
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────────────────────
   Add class="reveal" to any element; it fades + slides in when visible.
   ─────────────────────────────────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── PAGE INIT HOOK ─────────────────────────────────────────────────────
   Child pages may define:  window.pageInit = function() { ... }
   It will be called after the DOM is ready.
   ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.pageInit === 'function') window.pageInit();
});

document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);