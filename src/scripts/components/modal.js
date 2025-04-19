/**
 * ThemeModal
 * ----------------------------------------------------------------------------
 * A custom element for modal functionality with accessibility features.
 *
 * @emits modal:open
 * @emits modal:close
 *
 * Usage:
 * <theme-modal id="Modal" data-open="[js-modal-open-trigger]" data-close="[js-modal-close-trigger]">
 *  ...
 *  <button js-modal-close-trigger>Close Modal</button>
 * </theme-modal>
 *  <button js-modal-open-trigger>Open Modal</button>
 */

import { OverlayComponent } from '../abstract/overlay-component';

export class Modal extends OverlayComponent {
  constructor() {
    super({
      name: 'modal',
      openClasses: ['open'],
      closeClasses: ['close'],
      bodyOpenClasses: ['modal-open'],
      bodyCloseClasses: [],
      backdropSelector: '.modal-backdrop',
      backdropClasses: [],
    });
  }
}
