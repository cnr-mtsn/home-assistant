// Monochrome theme — near-black, minimal, clean
export const monochromeStyles = `
  :host {
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
