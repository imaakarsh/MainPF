import './oneko';
import { initTheme } from './core/theme';
import { initBlogFiltering, initBlogShowMore } from './features/blog';
import { initAvatarToggle, initRevealObserver, initTypingAnimation, initScrollProgress, initAnimatedCounters, initProgressBars, initCursorSpotlight } from './features/ui';
import { initNightSky } from './effects/nightSky';
import { initGitHubContributions, initVisitorCounter } from './features/gh';

function init(): void {
  initTheme();
  initAvatarToggle();
  initBlogFiltering();
  initBlogShowMore();
  initRevealObserver();
  initTypingAnimation();
  initScrollProgress();
  initAnimatedCounters();
  initProgressBars();
  initCursorSpotlight();
  initNightSky();
  initGitHubContributions();
  initVisitorCounter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
