export function initBlogFiltering(): void {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.blog-tag[data-blog-tag]'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.blog-card'));

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
  const button = document.getElementById('blog-show-more-btn') as HTMLButtonElement | null;
  const countEl = document.getElementById('blog-more-count') as HTMLSpanElement | null;
  const labelEl = document.querySelector<HTMLSpanElement>('.blog-show-more-label');
  const chevron = document.getElementById('blog-chevron') as SVGElement | null;
  const collapsedCards = Array.from(document.querySelectorAll<HTMLElement>('.blog-card--collapsed'));

  if (!button || !countEl || !labelEl || !chevron) return;

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
