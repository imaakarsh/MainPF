/**
 * theme.js — Dark / Light Mode Toggle + Glassmorphism Mobile Nav Overlay
 * ────────────────────────────────────────────────────────────────────────
 * THEME:
 *  1. Reads saved theme from localStorage (or OS preference).
 *  2. Applies it to <html data-theme="...">.
 *  3. Toggle button swaps the icon (🌙 ↔ ☀️) and persists the choice.
 *
 * MOBILE OVERLAY:
 *  - Hamburger (☰) button adds .overlay-open to #mobile-overlay.
 *  - Close (✕) button, Escape key, or clicking the dark backdrop removes it.
 *  - Body scroll is locked while the overlay is open.
 */

(function () {

  /* ─────────────────────────────────────────────────────────────
     1. THEME — apply initial theme immediately (no flash)
  ───────────────────────────────────────────────────────────── */

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  /* Update the toggle button icon to match the current theme */
  function updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /* Toggle between dark and light */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  }


  /* ─────────────────────────────────────────────────────────────
     2. GLASSMORPHISM MOBILE OVERLAY
  ───────────────────────────────────────────────────────────── */

  /* Open the overlay */
  function openOverlay() {
    const overlay = document.getElementById('mobile-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    if (!overlay) return;

    overlay.classList.add('overlay-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');

    /* Lock background scroll */
    document.body.style.overflow = 'hidden';
  }

  /* Close the overlay */
  function closeOverlay() {
    const overlay = document.getElementById('mobile-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    if (!overlay) return;

    overlay.classList.remove('overlay-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

    /* Restore background scroll */
    document.body.style.overflow = '';
  }


  /* ─────────────────────────────────────────────────────────────
     3. WIRE EVERYTHING UP ONCE THE DOM IS READY
  ───────────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {

    /* --- Theme toggle button --- */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      updateIcon(initialTheme);
      themeBtn.addEventListener('click', toggleTheme);
    }

    /* --- Hamburger (☰) — opens the overlay --- */
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', openOverlay);
    }

    /* --- Close (✕) button inside the card --- */
    const closeBtn = document.getElementById('mobile-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOverlay);
    }

    /* --- Click on the dark backdrop (outside the card) closes overlay --- */
    const overlay = document.getElementById('mobile-overlay');
    const card = document.getElementById('mobile-menu-card');
    if (overlay && card) {
      overlay.addEventListener('click', function (e) {
        /* Only close if the click was on the backdrop, not inside the card */
        if (!card.contains(e.target)) {
          closeOverlay();
        }
      });
    }

    /* --- Escape key closes the overlay --- */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
    });

    /* --- Clicking a nav link inside the overlay also closes it --- */
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeOverlay);
    });

  });

})();
