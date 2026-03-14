/**
 * matson-cards — index
 * Applies the correct CSS custom properties based on the --matson-card-style CSS variable
 * and re-exports all card registrations.
 *
 * Import order matters — styles are injected into document head so they apply globally.
 * Individual cards read CSS custom properties defined here.
 */

import { monochromeStyles } from './styles/monochrome.js';
import { liquidGlassStyles } from './styles/liquid-glass.js';

// Inject a shared <style> block into the document that maps the theme
// The individual card :host blocks inherit these vars
const injectThemeStyles = () => {
  const id = 'matson-cards-theme';
  if (document.getElementById(id)) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    /*
     * Matson Cards global theme loader
     * Set  --matson-card-style: liquid-glass;  in your HA theme CSS variables
     * to switch all cards to the liquid-glass style.
     * Default is monochrome.
     */

    /* Apply monochrome vars by default to all matson card hosts */
    matson-room-card, matson-light-card, matson-status-chip,
    matson-header-card, matson-hero-card {
      /* Monochrome defaults */
      --mc-bg: #111111;
      --mc-bg-card: #181818;
      --mc-bg-active: rgba(255, 220, 150, 0.10);
      --mc-border: 1px solid rgba(255,255,255,0.08);
      --mc-border-active: 1px solid rgba(255, 220, 150, 0.25);
      --mc-radius: 16px;
      --mc-radius-inner: 10px;
      --mc-text-primary: #f0f0f0;
      --mc-text-secondary: rgba(240,240,240,0.55);
      --mc-icon-active: #ffb938;
      --mc-icon-inactive: rgba(240,240,240,0.4);
      --mc-glow: 0 0 24px rgba(255, 200, 100, 0.12);
      --mc-shadow: 0 2px 8px rgba(0,0,0,0.5);
      --mc-transition: 300ms ease;
      --mc-slider-track: rgba(255,255,255,0.12);
      --mc-slider-thumb: #ffb938;
      --mc-toggle-off: rgba(255,255,255,0.15);
      --mc-toggle-on: #ffb938;
      --mc-chip-bg: rgba(255,255,255,0.07);
      --mc-chip-border: rgba(255,255,255,0.1);
      --mc-separator: rgba(255,255,255,0.08);
      --mc-font: system-ui, -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
    }
  `;
  document.head.appendChild(style);
};

injectThemeStyles();

// Load all cards
import './matson-status-chip.js';
import './matson-light-card.js';
import './matson-room-card.js';
import './matson-header-card.js';
import './matson-hero-card.js';

console.info(
  '%c MATSON-CARDS %c loaded ',
  'color: #ffb938; background: #111; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;',
  'background: #222; padding: 2px 4px; border-radius: 0 4px 4px 0;'
);
