/**
 * ThemeAccordions
 * ----------------------------------------------------------------------------
 * A custom element for accordion functionality with accessibility features.
 * Supports grouping of multiple accordion items with configurable behavior.
 *
 * Usage:
 * <theme-accordions data-allow-multiple-open="false" js-accordion>
 *   <div class="accordion-item" js-accordion-item>
 *     <button class="accordion-header" aria-expanded="true" aria-controls="accordionID" js-accordion-header>Title</button>
 *     <div id="accordionID" class="accordion-content" aria-hidden="false" js-accordion-content>Content</div>
 *   </div>
 * </theme-accordions>
 *
 * The following are selectors that the <theme-accordions> searches for
 * [js-accordion-item] - required
 * [js-accordion-header] - required
 * [js-accordion-content] - required
 * [data-allow-multiple-open] - optional
 */

export class Accordions extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.headers = [];
    this.contents = [];
    this.allowMultipleOpen = false;

    this.selectors = {
      item: '[js-accordion-item]',
      header: '[js-accordion-header]',
      content: '[js-accordion-content]',
    };
  }

  connectedCallback() {
    this.allowMultipleOpen = this.dataset.allowMultipleOpen === 'true';
    this.animate = this.dataset.animate === 'true';
    this.initElements();
    this.initEventListeners();
  }

  disconnectedCallback() {
    this.headers.forEach((header) => {
      header.removeEventListener('click', header.toggleHandler);
      header.removeEventListener('keydown', header.keydownHandler);
    });
  }

  initElements() {
    this.items = this.querySelectorAll(this.selectors.item);
    this.headers = this.querySelectorAll(this.selectors.header);
    this.contents = this.querySelectorAll(this.selectors.content);
  }

  initEventListeners() {
    this.headers.forEach((header) => {
      header.addEventListener('click', this.toggleAccordion.bind(this));
      header.addEventListener('keydown', this.handleKeyDown.bind(this));
    });
  }

  toggleAccordion(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const header = event.currentTarget;
    const contentSelector = `#${header.getAttribute('aria-controls')}`;
    const content = this.querySelector(contentSelector);

    if (!content) return;

    if (!this.allowMultipleOpen) {
      this.collapseAll(header);
    }

    this.toggleItem(header, content);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleAccordion(event);
    }
  }

  /**
   * Toggles an individual accordion item
   * @param {HTMLElement} header - The header element
   * @param {HTMLElement} content - The content element
   * @param {boolean} expand - Whether to expand (true) or collapse (false)
   */
  toggleItem(header, content) {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    content.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  }

  collapseAll(excludeHeader) {
    this.headers.forEach((header) => {
      if (header === excludeHeader) return;
      const contentSelector = `#${header.getAttribute('aria-controls')}`;
      const content = this.querySelector(contentSelector);
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        this.toggleItem(header, content);
      }
    });
  }
}
