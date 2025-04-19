/**
 * OverlayComponent
 *
 * A custom element for overlay functionality with accessibility features.
 * This is a base class for all overlay components.
 *
 * @param {Object} config - The configuration object for the overlay component.
 * @param {string} config.name - The name of the overlay component.
 * @param {string[]} config.openClasses - The classes to add when the overlay is open.
 * @param {string[]} config.closeClasses - The classes to add when the overlay is closed.
 * @param {string[]} config.bodyOpenClasses - The classes to add when the body is open.
 * @param {string[]} config.bodyCloseClasses - The classes to add when the body is closed.
 * @param {string} config.backdropSelector - The selector for the backdrop element.
 * @param {string[]} config.backdropClasses - The classes to add when the backdrop is active.
 * @param {Object} config.attributes - The attributes to add to component on initialization. { 'data-test': 'test' }
 */

import { utils } from '../global/utils';

export class OverlayComponent extends HTMLElement {
  constructor(config) {
    super();
    this.isOpen = false;
    this.config = config;
    this.defaultAttributes = {
      'data-overlay-component': true,
    };
    this.elements = {
      open: [],
      close: [],
      backdrop: null,
    };

    this.config.bodyOpenClasses.push('overlay-component-open');
  }

  connectedCallback() {
    this.setup();
    this.initElements();
    this.initA11yAttributes();
    this.initEventListeners();
  }

  disconnectedCallback() {
    this.elements.open.forEach((element) => {
      element.removeEventListener('click', this.open);
    });

    this.elements.close.forEach((element) => {
      element.removeEventListener('click', this.close);
    });

    this.elements.backdrop.removeEventListener('click', this.close);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  setup() {
    if (!this.id) {
      throw new Error(`${this.config.name} must have an id`);
    }

    this.config.openSelector = this.getAttribute('data-open');
    this.config.closeSelector = this.getAttribute('data-close');
  }

  initElements() {
    this.elements.open = document.querySelectorAll(this.config.openSelector);
    this.elements.close = document.querySelectorAll(this.config.closeSelector);
    this.elements.backdrop = document.querySelector(this.config.backdropSelector);
    const attributes = { ...this.defaultAttributes, ...this.config.attributes };
    for (const key in attributes) {
      this.setAttribute(key, attributes[key]);
    }
  }

  initA11yAttributes() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', 'true');
  }

  initEventListeners() {
    this.elements.open.forEach((element) => {
      element.addEventListener('click', this.open.bind(this));
    });

    this.elements.close.forEach((element) => {
      element.addEventListener('click', this.close.bind(this));
    });
  }

  open(event) {
    if (this.isOpen) return;
    this.toggle(event);
  }

  close(event) {
    if (!this.isOpen) return;
    this.toggle(event);
  }

  toggle(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Prevent focusing on element with aria-hidden="true" parent
    if (typeof document.activeElement?.blur === 'function') {
      document.activeElement.blur();
    }

    utils.prepareTransition(this);
    utils.prepareTransition(this.elements.backdrop);
    this.closeOtherOverlays();
    this.isOpen = !this.isOpen;
    this.updateClasses();
    if (this.isOpen) {
      this.bindEventListeners();
      utils.a11y.trapFocus(this);
    } else {
      this.unbindEventListeners();
      utils.a11y.removeTrapFocus();
    }
    this.updateA11yAttributes();
    this.dispatchEvents();
  }

  closeOtherOverlays() {
    const overlays = document.querySelectorAll('[data-overlay-component]');
    overlays.forEach((overlay) => {
      if (overlay !== this) {
        overlay.close();
      }
    });
  }

  updateA11yAttributes() {
    this.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
    this.elements.open.forEach((element) => {
      element.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
    });
    this.elements.close.forEach((element) => {
      element.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
    });
  }

  updateClasses() {
    if (this.isOpen) {
      this.classList.remove(...this.config.closeClasses);
      this.classList.add(...this.config.openClasses);
      this.elements.backdrop.classList.add(...this.config.backdropClasses);
      document.body.classList.remove(...this.config.bodyCloseClasses);
      document.body.classList.add(...this.config.bodyOpenClasses);
    } else {
      this.classList.remove(...this.config.openClasses);
      this.classList.add(...this.config.closeClasses);
      this.elements.backdrop.classList.remove(...this.config.backdropClasses);
      document.body.classList.remove(...this.config.bodyOpenClasses);
      document.body.classList.add(...this.config.bodyCloseClasses);
    }
  }

  bindEventListeners() {
    this.elements.backdrop.addEventListener('click', this.close.bind(this));
    document.addEventListener('keydown', this.handleKeyDown);
  }

  unbindEventListeners() {
    this.elements.backdrop.removeEventListener('click', this.close.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  dispatchEvents() {
    this.dispatchEvent(
      new CustomEvent(this.isOpen ? `${this.config.name}:open` : `${this.config.name}:close`, {
        bubbles: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent(this.isOpen ? `${this.id}:open` : `${this.id}:close`, {
        bubbles: true,
      })
    );
  }

  handleKeyDown(event) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      default:
        break;
    }
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
}
