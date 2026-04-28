import { byId, queryAll } from '../utils/dom';

export function initBlogFiltering(): void {
  const buttons = queryAll<HTMLButtonElement>('.blog-tag[data-blog-tag]');
  const cards = queryAll<HTMLElement>('.blog-card');

  if (buttons.length === 0 || cards.length === 0) {
    console.debug('Blog filtering elements not found');
    return;
  }

  const applyFilter = (button: HTMLButtonElement, tag: string): void => {
    buttons.forEach((otherButton) => otherButton.classList.remove('active'));
    button.classList.add('active');

    cards.forEach((card) => {
      if (tag === 'all') {
        card.classList.remove('hidden');
        return;
      }

      const tags = card.getAttribute('data-tags') ?? '';
      const visible = tags.split(' ').includes(tag);
      card.classList.toggle('hidden', !visible);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button, button.dataset.blogTag ?? 'all');
    });
  });
}

export function initBlogShowMore(): void {
  const button = byId<HTMLButtonElement>('blog-show-more-btn');
  const countEl = byId<HTMLSpanElement>('blog-more-count');
  const labelEl = byId<HTMLSpanElement>('.blog-show-more-label');
  const chevron = byId<SVGElement>('blog-chevron');
  const collapsedCards = queryAll<HTMLElement>('.blog-card--collapsed');

  if (!button || !countEl || !labelEl || !chevron || collapsedCards.length === 0) {
    console.debug('Blog show more elements not found');
    return;
  }

  const setExpanded = (expanded: boolean): void => {
    if (expanded) {
      collapsedCards.forEach((card) => {
        card.style.display = 'flex';
      });
      button.classList.add('expanded');
      chevron.style.transform = 'rotate(180deg)';
      countEl.textContent = '';
      labelEl.textContent = 'Show Less';
      return;
    }

    collapsedCards.forEach((card) => {
      card.style.display = '';
    });
    button.classList.remove('expanded');
    chevron.style.transform = '';
    countEl.textContent = collapsedCards.length > 0 ? `(${collapsedCards.length} more)` : '';
    labelEl.textContent = 'Show More';
  };

  setExpanded(false);
  button.addEventListener('click', () => {
    setExpanded(!button.classList.contains('expanded'));
  });
}
