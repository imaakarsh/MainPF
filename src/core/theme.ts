type Theme = 'light' | 'dark';

export const themeStorageKey = 'portfolio-theme';

export function initTheme(): void {
  const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement | null;
  const themeToggleIcon = document.getElementById('theme-toggle-icon') as HTMLSpanElement | null;

  const getTheme = (): Theme => {
    const current = document.documentElement.getAttribute('data-theme');
    return current === 'light' ? 'light' : 'dark';
  };

  const applyTheme = (theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch {
      // ignore
    }

    const isLight = theme === 'light';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
      themeToggle.title = isLight ? 'Toggle dark mode' : 'Toggle light mode';
    }

    if (themeToggleIcon) {
      themeToggleIcon.textContent = isLight ? '☀' : '☾';
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(getTheme() === 'light' ? 'dark' : 'light');
    });
  }

  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme as Theme);
    } else {
      applyTheme(getTheme());
    }
  } catch {
    applyTheme(getTheme());
  }
}
