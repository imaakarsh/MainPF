const typingPhrases = [
  'Full Stack Developer.',
  'Creative Coder.',
  'Problem Solver.',
  'Open Source Enthusiast.',
  'Lifelong Learner.',
];

function byId<T extends Element>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function initAvatarToggle(): void {
  const avatar = byId<HTMLImageElement>('about-avatar-img');
  if (!avatar) return;

  avatar.addEventListener('click', () => {
    avatar.classList.toggle('avatar-clicked');
  });
}

export function initRevealObserver(): void {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

export function initTypingAnimation(): void {
  const typingText = byId<HTMLSpanElement>('typing-text');
  if (!typingText) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const step = (): void => {
    const phrase = typingPhrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        window.setTimeout(step, 1800);
        return;
      }
    } else {
      charIndex -= 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      }
    }

    window.setTimeout(step, deleting ? 45 : 80);
  };

  step();
}

export function initScrollProgress(): void {
  const progressBar = byId<HTMLDivElement>('scroll-progress');
  if (!progressBar) return;

  const update = (): void => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function initAnimatedCounters(): void {
  const animateCounters = (): void => {
    document.querySelectorAll<HTMLElement>('.stat-value[data-target]').forEach((element) => {
      const target = Number(element.getAttribute('data-target'));
      const duration = 1200;
      const step = target / (duration / 16);
      let current = 0;

      const timer = window.setInterval(() => {
        current = Math.min(current + step, target);
        element.textContent = `${Math.round(current)}+`;
        if (current >= target) {
          window.clearInterval(timer);
        }
      }, 16);
    });
  };

  const statsSection = document.querySelector<HTMLElement>('.stats-section');
  if (!statsSection) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);
}

export function initProgressBars(): void {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll<HTMLElement>('.progress-bar').forEach((bar) => {
          const width = bar.getAttribute('data-width');
          if (width) {
            bar.style.width = `${width}%`;
          }
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll<HTMLElement>('#learning').forEach((element) => barObserver.observe(element));
}

export function initCursorSpotlight(): void {
  const spotlight = document.getElementById('cursor-spotlight') as HTMLDivElement | null;
  if (!spotlight) return;

  document.addEventListener('mousemove', (event) => {
    spotlight.style.left = `${event.clientX}px`;
    spotlight.style.top = `${event.clientY}px`;
  });
}
