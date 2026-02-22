/**
 * theme.js — Dark / Light Mode Toggle
 * ─────────────────────────────────────
 * How it works:
 *  1. On page load, reads the saved theme from localStorage.
 *  2. If no saved theme exists, checks the user's OS preference (prefers-color-scheme).
 *  3. Applies the theme by setting data-theme on <html>.
 *  4. The toggle button swaps the icon (🌙 ↔ ☀️) and saves the choice.
 */

(function () {

  /* ── 1. Determine the initial theme ─────────────────────────────── */

  // Check localStorage for a previously saved preference
  const saved = localStorage.getItem('theme');

  // Check the OS / system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Decide: saved preference wins; otherwise follow the OS
  const initialTheme = saved ? saved : (prefersDark ? 'dark' : 'light');

  // Apply the theme immediately (before the page fully renders) to avoid a flash
  document.documentElement.setAttribute('data-theme', initialTheme);


  /* ── 2. Update the button icon to match the active theme ─────────── */

  function updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Show moon when dark (click to go light), show sun when light (click to go dark)
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }


  /* ── 3. Toggle function ──────────────────────────────────────────── */

  function toggleTheme() {
    // Read the CURRENT theme from the <html> element
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    // Apply the new theme
    document.documentElement.setAttribute('data-theme', next);

    // Save the choice so it persists on reload and across pages
    localStorage.setItem('theme', next);

    // Update the button icon
    updateIcon(next);
  }


  /* ── 4. Wire up the button once the DOM is ready ─────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      // Set correct icon on page load
      updateIcon(initialTheme);

      // Listen for clicks
      btn.addEventListener('click', toggleTheme);
    }
  });

})();
