/**
 * ThemeDrawer
 * ----------------------------------------------------------------------------
 * A custom element for drawer functionality with accessibility features.
 *
 * @emits drawer:open
 * @emits drawer:close
 *
 * Usage:
 * <theme-drawer id="Drawer" data-open="[js-drawer-open-trigger]" data-close="[js-drawer-close-trigger]" data-position="right">
 *  ...
 *  <button js-drawer-close-trigger>Close Drawer</button>
 * </theme-drawer>
 *  <button js-drawer-open-trigger>Open Drawer</button>
 */

import { OverlayComponent } from '../abstract/overlay-component';

export class Drawer extends OverlayComponent {
  constructor() {
    super({
      name: 'drawer',
      openClasses: ['open'],
      closeClasses: ['close'],
      bodyOpenClasses: ['drawer-open'],
      bodyCloseClasses: [],
      backdropSelector: '.drawer-backdrop',
      backdropClasses: [],
    });

    this.position = this.getAttribute('data-position');
    if (!this.position) {
      throw new Error('Drawer must have a position attribute');
    }

    this.updateConfig({
      bodyOpenClasses: [...this.config.bodyOpenClasses, `drawer-${this.position}-open`],
    });
  }
}
