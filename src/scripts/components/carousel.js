/**
 * ThemeCarousel
 * ----------------------------------------------------------------------------
 * A custom element for carousel functionality using Swiper.js
 * Supports configuring carousels via data attributes with advanced options.
 *
 * Usage:
 * <theme-carousel data-options='{"slidesPerView": 3, "spaceBetween": 10}' data-init="desktop">
 *   <div id="carousel-1" class="swiper" js-carousel>
 *     <div class="swiper-wrapper">
 *       <div class="swiper-slide" js-carousel-slide>Slide 1</div>
 *       <div class="swiper-slide" js-carousel-slide>Slide 2</div>
 *       <div class="swiper-slide" js-carousel-slide>Slide 3</div>
 *     </div>
 *     <div class="swiper-button-prev"></div>
 *     <div class="swiper-button-next"></div>
 *     <div class="swiper-pagination"></div>
 *   </div>
 * </theme-carousel>
 *
 * data-options - optional, JSON string of Swiper options
 * data-init - optional, media query to initialize the carousel at -- see config.js
 *
 * [js-carousel] - required, this contains the slides and the arrows.
 * id - required, should be same element as [js-carousel]
 * .swiper - required class
 * .swiper-wrapper - required class
 * [js-carousel-slide] - required, each slide element needs this (differentiates from the arrows)
 * .swiper-slide - required class
 * .swiper-pagination - optional, custom {{pagination_class}} required if using pagination
 * .swiper-button-prev - optional, custom {{prev_button_class}} required if using navigation
 * .swiper-button-next - optional, custom {{next_button_class}} required if using navigation
 */

import Swiper from 'swiper';
import { config } from '../global/config';
export class Carousel extends HTMLElement {
  constructor() {
    super();
    this.carousel = null;
    this.options = {};
    this.initBreakpoint = 0;

    this.selectors = {
      container: '[js-carousel]',
      slide: '[js-carousel-slide]',
    };

    this.options = {
      grabCursor: true,
      navigation: false,
      pagination: false,
      a11y: true,
    };

    this.carousel = null;
    this.breakpoint = null;
  }

  connectedCallback() {
    console.log('Carousel connected');
    this.setupConfig();
    if (this.shouldInitCarousel()) {
      this.initCarousel();
      this.initResizeListener();
    }
  }

  setupConfig() {
    this.breakpoint = this.dataset.init ? config.breakpoints[this.dataset.init] : null;
    this.container = this.querySelector(this.selectors.container);
    console.log('Container:', this.container);
    console.log('Breakpoint:', this.breakpoint);
    if (!this.container) return;

    // Parse options from data attribute
    if (this.dataset.options) {
      try {
        this.options = { ...this.options, ...JSON.parse(this.dataset.options) };
      } catch (e) {
        console.error('Error parsing carousel options:', e);
        this.options = {};
      }
    }
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize);

    // Destroy Swiper instance if it exists
    if (this.carousel) {
      this.carousel.destroy(true, true);
      this.carousel = null;
    }
  }

  initCarousel() {
    console.log('Initializing carousel');
    console.log('Carousel:', this.carousel);
    // Don't initialize if already initialized or if Swiper isn't available
    if (this.carousel) return;

    // Initialize Swiper
    console.log(this.container.id);
    this.carousel = new Swiper(`#${this.container.id}`, this.options);
    console.log('Carousel initialized:', this.carousel);
  }

  handleResize() {
    const shouldInit = this.shouldInitCarousel();
    if (shouldInit && !this.carousel) {
      this.initCarousel();
    } else if (!shouldInit && this.carousel) {
      this.carousel.destroy(true, true);
      this.carousel = null;
    }
  }

  shouldInitCarousel() {
    if (!this.breakpoint) return true;
    return window.matchMedia(this.breakpoint).matches;
  }

  initResizeListener() {
    if (!this.breakpoint) return;
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  reinitCarousel() {
    if (this.carousel) {
      this.carousel.destroy(true, true);
      this.carousel = null;
    }
    this.initCarousel();
  }
}
