/**
 * DOM utility functions for safer element selection and manipulation
 */

/**
 * Safely get an element by ID with proper typing
 * @param id - The element ID
 * @returns The element or null if not found
 */
export function byId<T extends Element>(id: string): T | null {
  try {
    return document.getElementById(id) as T | null;
  } catch {
    console.warn(`Failed to get element with id: ${id}`);
    return null;
  }
}

/**
 * Query all elements matching a selector
 * @param selector - CSS selector
 * @param parent - Parent element to query within (defaults to document)
 * @returns Array of matching elements
 */
export function queryAll<T extends Element>(
  selector: string,
  parent: Document | Element = document
): T[] {
  try {
    return Array.from(parent.querySelectorAll<T>(selector));
  } catch {
    console.warn(`Failed to query elements with selector: ${selector}`);
    return [];
  }
}

/**
 * Query a single element
 * @param selector - CSS selector
 * @param parent - Parent element to query within (defaults to document)
 * @returns The element or null
 */
export function query<T extends Element>(
  selector: string,
  parent: Document | Element = document
): T | null {
  try {
    return parent.querySelector<T>(selector) ?? null;
  } catch {
    console.warn(`Failed to query element with selector: ${selector}`);
    return null;
  }
}

/**
 * Safely add/remove classes with error handling
 */
export const classList = {
  add(element: Element | null, ...classes: string[]): void {
    if (!element) return;
    try {
      element.classList.add(...classes);
    } catch {
      console.warn('Failed to add classes', classes);
    }
  },
  remove(element: Element | null, ...classes: string[]): void {
    if (!element) return;
    try {
      element.classList.remove(...classes);
    } catch {
      console.warn('Failed to remove classes', classes);
    }
  },
  toggle(element: Element | null, className: string, force?: boolean): void {
    if (!element) return;
    try {
      element.classList.toggle(className, force);
    } catch {
      console.warn('Failed to toggle class', className);
    }
  },
  has(element: Element | null, className: string): boolean {
    if (!element) return false;
    try {
      return element.classList.contains(className);
    } catch {
      return false;
    }
  },
};

/**
 * Debounce a function to limit call frequency
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle a function to limit call frequency
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        fn(...args);
        lastCall = Date.now();
        timeoutId = null;
      }, delay - (now - lastCall));
    }
  };
}
