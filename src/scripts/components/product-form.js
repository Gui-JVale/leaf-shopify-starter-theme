import { GLOBAL_ELEMENTS_IDS } from '../global/constants';
import { PUB_SUB_EVENTS, publish } from '../global/pubsub';
import { utils } from '../global/utils';

export class ProductForm extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      form: 'form',
      variantIdInput: '[name=id]',
      submitButton: '[type="submit"]',
      errorMessageWrapper: 'js-error-message-wrapper',
      submitButtonText: 'span',
    };
  }

  connectedCallback() {
    this.initElements();
    this.initEventListeners();
  }

  initElements() {
    this.form = this.querySelector(this.selectors.form);
    this.variantIdInput = this.querySelector(this.selectors.variantIdInput);
    this.submitButton = this.querySelector(this.selectors.submitButton);
    this.errorMessageWrapper = this.querySelector(this.selectors.errorMessageWrapper);
    this.cart = document.getElementById(GLOBAL_ELEMENTS_IDS.cartDrawer);
  }

  initEventListeners() {
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

    this.handleErrorMessage();

    this.toggleSubmitButton(true);

    const config = {
      method: 'POST',
      headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
    };

    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append(
        'sections',
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append('sections_url', window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          publish(PUB_SUB_EVENTS.cartError, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            errors: response.errors || response.description,
            message: response.message,
          });

          this.handleErrorMessage(response.description);
          this.toggleSubmitButton(true, 'Sold out');
          this.error = true;
          return;
        }

        if (!this.error) {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            cartData: response,
          });

          if (this.cart) {
            this.cart.renderContents(response);
          }
        }
        this.error = false;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.toggleSubmitButton(false);
      });
  }

  handleErrorMessage(errorMessage = false) {
    if (!this.errorMessageWrapper) return;

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  }

  toggleSubmitButton(disable = true, text) {
    if (disable) {
      this.submitButton.setAttribute('aria-disabled', 'true');
      this.submitButton.setAttribute('disabled', 'disabled');
      if (text) this.submitButton.textContent = text;
    } else {
      this.submitButton.removeAttribute('aria-disabled');
      this.submitButton.removeAttribute('disabled');
      this.submitButton.textContent = window.variantStrings.addToCart;
    }
  }
}
