/**
 * Product Options
 *
 * @description
 * A custom element that allows users to select a variant of a product.
 *
 * Option selector inputs must have:
 * - js-product-option-selector attribute
 * - data-index attribute with option1 | option2 | option3
 *
 * @example
 * <product-options data-product="#ProductJson">
 *  (see product-option.liquid for how to setup options)
 * </product-options>
 */

import { utils } from '../global/utils';
import { PUB_SUB_EVENTS, publish } from '../global/pubsub';

export class ProductOptions extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      optionSelector: '[js-product-option-selector]',
    };

    this.product = null;
    this.productJson = this.dataset.product;
    this.optionInputs = [];
    this.selectedVariant = null;
    this.variantSelect = null;
    this.shouldUpdateVariantSelect = false;
  }

  connectedCallback() {
    this.shouldUpdateVariantSelect = this.dataset.updateVariantSelect === 'true';
    console.log('yoo', this.shouldUpdateVariantSelect);
    this.initProduct();
    this.initElements();
    this.initEventListeners();
    this.updateSelectedVariant();
  }

  initProduct() {
    try {
      const productJson = document.querySelector(this.dataset.product);
      this.product = JSON.parse(productJson.innerHTML);
    } catch (error) {
      console.error('variant-select: failed to get product data from productJson');
    }
  }

  initElements() {
    this.optionInputs = [...this.querySelectorAll(this.selectors.optionSelector)];
    if (this.dataset.variantSelectId) {
      this.variantSelect = document.getElementById(this.dataset.variantSelectId);
    }
  }

  initEventListeners() {
    this.optionInputs.forEach((optionInput) => {
      optionInput.addEventListener('change', this.handleChange.bind(this));
    });
  }

  handleChange() {
    this.updateSelectedVariant();
  }

  updateSelectedVariant() {
    const selectedOptions = this.getCurrentOptions();
    const variant = this.product.variants.find((variant) => {
      return selectedOptions.every(
        (option) => utils.handleize(option.value) === utils.handleize(variant[option.index])
      );
    });

    if (variant) {
      this.selectedVariant = variant;
    }

    if (this.shouldUpdateVariantSelect) {
      this.updateVariantSelect();
    }

    publish(PUB_SUB_EVENTS.variantChange, {
      variant,
    });

    this.dispatchEvent(
      new CustomEvent('variant:change', {
        detail: { variant },
        bubbles: true,
      })
    );
  }

  updateVariantSelect() {
    if (!this.selectedVariant) return;
    this.variantSelect.value = this.selectedVariant?.id;
  }

  getCurrentOptions() {
    return this.optionInputs
      .map((input) => {
        const type = input.getAttribute('type');
        const currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if (input.checked) {
            currentOption.value = input.value;
            currentOption.index = input.dataset.index;

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = input.value;
          currentOption.index = input.dataset.index;
          return currentOption;
        }
      })
      .filter((option) => option);
  }
}
