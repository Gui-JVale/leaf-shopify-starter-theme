import './global/shopify-common';
import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import { utils } from './global/utils';
import { Modal } from './components/modal';
import { Drawer } from './components/drawer';
import { Accordions } from './components/accordions';
import { Carousel } from './components/carousel';

Swiper.use([Navigation, Pagination, A11y]);

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(':focus-visible');
} catch (e) {
  utils.a11y.focusVisiblePolyfill();
}

customElements.define('theme-modal', Modal);
customElements.define('theme-drawer', Drawer);
customElements.define('theme-accordions', Accordions);
customElements.define('theme-carousel', Carousel);
