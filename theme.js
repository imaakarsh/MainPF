

(function () {



  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  
  function updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  }



  function openOverlay() {
    const overlay = document.getElementById('mobile-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    if (!overlay) return;

    overlay.classList.add('overlay-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');

    /* background scroll */
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




  document.addEventListener('DOMContentLoaded', function () {

    /* Theme toggle button */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      updateIcon(initialTheme);
      themeBtn.addEventListener('click', toggleTheme);
    }

    /*  opens the overlay */
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', openOverlay);
    }

    /* Close button inside the card  */
    const closeBtn = document.getElementById('mobile-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOverlay);
    }

    
    const overlay = document.getElementById('mobile-overlay');
    const card = document.getElementById('mobile-menu-card');
    if (overlay && card) {
      overlay.addEventListener('click', function (e) {
        
        if (!card.contains(e.target)) {
          closeOverlay();
        }
      });
    }

    
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
    });

    
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeOverlay);
    });

  });

})();
