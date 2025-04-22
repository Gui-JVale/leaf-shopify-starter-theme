export const utils = {
  a11y: {
    getFocusableElements(container) {
      return Array.from(
        container.querySelectorAll(
          "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
        )
      );
    },

    trapFocusHandlers: {},

    trapFocus(container, elementToFocus = container) {
      const elements = this.getFocusableElements(container);
      const first = elements[0];
      const last = elements[elements.length - 1];

      this.removeTrapFocus();

      this.trapFocusHandlers.focusin = (event) => {
        if (event.target !== container && event.target !== last && event.target !== first) return;

        document.addEventListener('keydown', this.trapFocusHandlers.keydown);
      };

      this.trapFocusHandlers.focusout = () => {
        document.removeEventListener('keydown', this.trapFocusHandlers.keydown);
      };

      this.trapFocusHandlers.keydown = function (event) {
        if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
        // On the last focusable element and tab forward, focus the first element.
        if (event.target === last && !event.shiftKey) {
          event.preventDefault();
          first.focus();
        }

        //  On the first focusable element and tab backward, focus the last element.
        if ((event.target === container || event.target === first) && event.shiftKey) {
          event.preventDefault();
          last.focus();
        }
      };

      document.addEventListener('focusout', this.trapFocusHandlers.focusout);
      document.addEventListener('focusin', this.trapFocusHandlers.focusin);

      elementToFocus.focus();

      if (
        elementToFocus.tagName === 'INPUT' &&
        ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
        elementToFocus.value
      ) {
        elementToFocus.setSelectionRange(0, elementToFocus.value.length);
      }
    },

    removeTrapFocus(elementToFocus = null) {
      document.removeEventListener('focusin', this.trapFocusHandlers.focusin);
      document.removeEventListener('focusout', this.trapFocusHandlers.focusout);
      document.removeEventListener('keydown', this.trapFocusHandlers.keydown);

      if (elementToFocus) elementToFocus.focus();
    },

    focusVisiblePolyfill() {
      const navKeys = [
        'ARROWUP',
        'ARROWDOWN',
        'ARROWLEFT',
        'ARROWRIGHT',
        'TAB',
        'ENTER',
        'SPACE',
        'ESCAPE',
        'HOME',
        'END',
        'PAGEUP',
        'PAGEDOWN',
      ];
      let currentFocusedElement = null;
      let mouseClick = null;

      window.addEventListener('keydown', (event) => {
        if (navKeys.includes(event.code.toUpperCase())) {
          mouseClick = false;
        }
      });

      window.addEventListener('mousedown', (event) => {
        mouseClick = true;
      });

      window.addEventListener(
        'focus',
        () => {
          if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

          if (mouseClick) return;

          currentFocusedElement = document.activeElement;
          currentFocusedElement.classList.add('focused');
        },
        true
      );
    },
  },

  prepareTransition(element) {
    element.addEventListener('transitionend', () => {
      element.classList.remove('is-transitioning');
    });

    // check the various CSS properties to see if a duration has been set
    var cl = [
      'transition-duration',
      '-moz-transition-duration',
      '-webkit-transition-duration',
      '-o-transition-duration',
    ];
    let duration = 0;
    const computedStyles = getComputedStyle(element);
    cl.forEach((prop) => duration || (duration = parseFloat(computedStyles.getPropertyValue(prop))));

    // if I have a duration then add the class
    if (duration != 0) {
      element.classList.add('is-transitioning');
      element.offsetWidth; // check offsetWidth to force the style rendering
    }
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    };
  },

  handleize(string) {
    return string
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-$/, '')
      .replace(/^-/, '');
  },

  fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
  },
};
