/**
 * QuantityInput
 * ----------------------------------------------------------------------------
 * A custom element for quantity input with accessibility features.
 *
 * Usage:
 * <quantity-input>
 *  <label for="quantity-input">{{ 'product.quantity.label' | t }}</label>
 *  <button
 *    name="minus"
 *    arial-label="{{ 'product.quantity.decrease' | t: product: product.title }}"
 *    title="{{ 'product.quantity.decrease' | t: product: product.title }}"
 *    type="button"
 *    js-quantity-button-minus
 *  >
 *    &minus;
 *  </button>
 *  <input id="quantity-input" type="number" name="quantity" value="1" min="1" max="10">
 *  <button
 *    name="plus"
 *    arial-label="{{ 'product.quantity.increase' | t: product: product.title }}"
 *    title="{{ 'product.quantity.increase' | t: product: product.title }}"
 *    type="button"
 *    js-quantity-button-plus
 *  </button>
 * </quantity-input>
 */
export class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      input: 'input',
      buttonMinus: 'js-quantity-button-minus',
      buttonPlus: 'js-quantity-button-plus',
    };
  }

  connectedCallback() {
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });
    this.input.addEventListener('change', this.onInputChange.bind(this));
    this.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this))
    );
    this.validateQtyRules();
  }

  disconnectedCallback() {
    this.input.removeEventListener('change', this.onInputChange.bind(this));
    this.querySelectorAll('button').forEach((button) =>
      button.removeEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onInputChange(event) {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    if (event.target.name === 'plus') {
      if (parseInt(this.input.dataset.min) > parseInt(this.input.step) && this.input.value == 0) {
        this.input.value = this.input.dataset.min;
      } else {
        this.input.stepUp();
      }
    } else {
      this.input.stepDown();
    }

    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);

    if (this.input.dataset.min === previousValue && event.target.name === 'minus') {
      this.input.value = parseInt(this.input.min);
    }
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    if (this.input.min) {
      const buttonMinus = this.querySelector(this.selectors.buttonMinus);
      if (buttonMinus) {
        buttonMinus.classList.toggle('disabled', parseInt(value) <= parseInt(this.input.min));
      }
    }
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonPlus = this.querySelector(this.selectors.buttonPlus);
      if (buttonPlus) {
        buttonPlus.classList.toggle('disabled', value >= max);
      }
    }
  }
}
