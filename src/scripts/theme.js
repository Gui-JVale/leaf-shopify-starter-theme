import { utils } from './global/utils';
import { ThemeModal } from './components/theme-modal';
import { ThemeDrawer } from './components/theme-drawer';

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(':focus-visible');
} catch (e) {
  utils.a11y.focusVisiblePolyfill();
}

customElements.define('theme-modal', ThemeModal);
customElements.define('theme-drawer', ThemeDrawer);
