type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionWeek = { contributionDays: ContributionDay[] };

type ContributionApiResponse = {
  contributions?: ContributionDay[];
  total?: Record<string, number>;
  weeks?: ContributionWeek[];
};

const githubUsername = 'imaakarsh';

function byId<T extends Element>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function initGitHubContributions(): void {
  const ghCard = byId<HTMLDivElement>('gh-glass-card');
  const ghTotal = byId<HTMLSpanElement>('gh-total');
  const gridEl = byId<HTMLDivElement>('gh-calendar-grid');
  const monthsEl = byId<HTMLDivElement>('gh-calendar-months');

  if (ghCard) {
    const ghObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gh-animated');
          ghObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    ghObserver.observe(ghCard);
  }

  const animateValue = (element: HTMLElement, target: number, suffix = ''): void => {
    const duration = 1100;
    const step = target / (duration / 16);
    let current = 0;

    const timer = window.setInterval(() => {
      current = Math.min(current + step, target);
      element.textContent = `${Math.round(current)}${suffix}`;
      if (current >= target) {
        window.clearInterval(timer);
      }
    }, 16);
  };

  const computeStreaks = (weeks: ContributionWeek[]): { total: number; current: number; longest: number } => {
    const days: ContributionDay[] = [];
    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => days.push(day));
    });

    let total = 0;
    let longest = 0;
    let current = 0;

    for (let index = 0; index < days.length; index += 1) {
      const contribution = days[index].count;
      total += contribution;
      if (contribution > 0) {
        current += 1;
        if (current > longest) longest = current;
      } else {
        const dayDate = new Date(days[index].date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dayDate < today) {
          current = 0;
        }
      }
    }

    return { total, current, longest };
  };

  const renderGitHubGrid = (sorted: ContributionDay[]): void => {
    if (!gridEl || !monthsEl || sorted.length === 0) return;

    const weeks: Array<Array<ContributionDay | null>> = [];
    let currentWeek: Array<ContributionDay | null> = [];

    const firstDayIndex = new Date(sorted[0].date).getDay();
    for (let index = 0; index < firstDayIndex; index += 1) {
      currentWeek.push(null);
    }

    sorted.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    let html = '';
    let monthsHtml = '';
    let lastMonth = -1;

    weeks.forEach((week, columnIndex) => {
      html += '<div class="gh-column">';
      const firstValid = week.find((day): day is ContributionDay => day !== null);
      if (firstValid) {
        const month = new Date(firstValid.date).getMonth();
        if (month !== lastMonth) {
          monthsHtml += `<span style="position: absolute; left: ${columnIndex * 14}px;">${new Date(firstValid.date).toLocaleString('default', { month: 'short' })}</span>`;
          lastMonth = month;
        }
      }

      week.forEach((day) => {
        if (!day) {
          html += '<div class="gh-cell gh-empty"></div>';
        } else {
          html += `<div class="gh-cell gh-level-${day.level}" title="${day.count} contributions on ${day.date}"></div>`;
        }
      });

      html += '</div>';
    });

    gridEl.innerHTML = html;
    monthsEl.innerHTML = monthsHtml;
  };

  const updateStats = (total: number): void => {
    if (!ghTotal || !ghCard) return;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(ghTotal, total, '');
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(ghCard);
  };

  const tryFallback = async (): Promise<void> => {
    try {
      const response = await fetch(`https://github-contributions-api.deno.dev/${githubUsername}.json`);
      if (!response.ok) throw new Error('Fallback API error');
      const data = await response.json() as { contributions?: ContributionWeek[] };
      const weeks = data.contributions ?? [];
      const { total } = computeStreaks(weeks);
      updateStats(total);
    } catch (error) {
      console.warn('[GH Stats] Fallback failed.', error);
    }
  };

  const fetchGitHubStats = async (): Promise<void> => {
    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`, { cache: 'no-cache' });
      if (!response.ok) throw new Error('API error');
      const data = await response.json() as ContributionApiResponse;
      const contributions = data.contributions ?? [];
      const totalValue = contributions.reduce((sum, day) => sum + (day.count ?? 0), 0);
      const sorted = [...contributions].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
      renderGitHubGrid(sorted);
      updateStats(totalValue);
    } catch (error) {
      console.warn('[GH Stats] Primary API failed, trying fallback…', error);
      await tryFallback();
    }
  };

  void fetchGitHubStats();
}

export function initVisitorCounter(): void {
  const namespace = 'aakarshdev-portfolio';
  const key = 'pageviews';
  const pollMs = 30_000;
  const countEl = document.getElementById('visitor-count') as HTMLSpanElement | null;
  let lastValue: number | null = null;

  if (!countEl) return;

  const setCount = (target: number, animate: boolean): void => {
    if (!animate || lastValue === null) {
      const duration = 1000;
      const step = Math.max(1, Math.floor(target / (duration / 16)));
      let current = Math.max(0, target - step * 20);
      countEl.textContent = current.toLocaleString();
      const timer = window.setInterval(() => {
        current = Math.min(current + step, target);
        countEl.textContent = current.toLocaleString();
        if (current >= target) {
          window.clearInterval(timer);
        }
      }, 16);
    } else if (target !== lastValue) {
      const diff = target - lastValue;
      const steps = Math.abs(diff);
      const direction = Math.sign(diff);
      let done = 0;
      let current = lastValue;
      const timer = window.setInterval(() => {
        current += direction;
        countEl.textContent = current.toLocaleString();
        done += 1;
        if (done >= steps) {
          window.clearInterval(timer);
        }
      }, Math.max(16, Math.round(300 / steps)));
    }

    lastValue = target;
  };

  const fetchCount = async (isFirst: boolean): Promise<void> => {
    try {
      const firstVisit = isFirst && !sessionStorage.getItem('vc_counted');
      const endpoint = firstVisit
        ? `https://api.counterapi.dev/v1/${namespace}/${key}/up`
        : `https://api.counterapi.dev/v1/${namespace}/${key}`;

      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error(`counterapi ${response.status}`);
      const data = await response.json() as { count?: number };

      if (firstVisit) {
        sessionStorage.setItem('vc_counted', '1');
      }

      if (data.count != null) {
        setCount(data.count, !isFirst);
      }
    } catch (error) {
      console.warn('[Visitor Counter]', error);
    }
  };

  void fetchCount(true);
  window.setInterval(() => {
    void fetchCount(false);
  }, pollMs);
}
