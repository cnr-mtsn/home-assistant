/**
 * matson-status-chip
 * A small status chip/badge showing entity state with icon and configurable color.
 *
 * Config:
 *   entity: string          — HA entity ID
 *   name: string            — optional display label (falls back to friendly_name)
 *   icon: string            — MDI icon (e.g. "mdi:account")
 *   state_colors:           — optional map of state → CSS color
 *     home: "#4caf50"
 *     away: "#f44336"
 *   style: "monochrome" | "liquid-glass"
 */
import { LitElement, html, css } from 'https://esm.sh/lit@3';

const baseStyles = css`
  :host {
    display: inline-block;
    font-family: var(--mc-font, system-ui, sans-serif);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px 5px 8px;
    border-radius: 999px;
    background: var(--mc-chip-bg, rgba(255,255,255,0.07));
    border: var(--mc-chip-border, 1px solid rgba(255,255,255,0.1));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
    box-shadow: var(--mc-shadow, none);
    transition: background var(--mc-transition, 300ms ease),
                border-color var(--mc-transition, 300ms ease);
    cursor: default;
    user-select: none;
  }
  .chip ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: color var(--mc-transition, 300ms ease);
  }
  .label {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    color: var(--mc-text-primary, #f0f0f0);
    white-space: nowrap;
  }
  .state-text {
    font-size: 11px;
    font-weight: 400;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    white-space: nowrap;
  }
`;

class MatsonStatusChip extends LitElement {
  static get properties() {
    return {
      _hass: { state: true },
      _config: { state: true },
    };
  }

  static get styles() { return baseStyles; }

  setConfig(config) {
    if (!config.entity) throw new Error('matson-status-chip requires an entity');
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() { return 1; }

  _getColor(state) {
    if (!this._config.state_colors) return null;
    return this._config.state_colors[state] || null;
  }

  render() {
    if (!this._hass || !this._config) return html``;
    const stateObj = this._hass.states[this._config.entity];
    const state = stateObj ? stateObj.state : 'unavailable';
    const friendlyName = stateObj?.attributes?.friendly_name || this._config.entity;
    const label = this._config.name || friendlyName;
    const icon = this._config.icon || stateObj?.attributes?.icon || 'mdi:circle';
    const color = this._getColor(state);

    const iconStyle = color ? `color: ${color};` : `color: var(--mc-icon-inactive);`;

    return html`
      <div class="chip">
        <ha-icon
          .icon="${icon}"
          style="${iconStyle}"
        ></ha-icon>
        <span class="label">${label}</span>
        <span class="state-text">${state}</span>
      </div>
    `;
  }
}

customElements.define('matson-status-chip', MatsonStatusChip);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'matson-status-chip',
  name: 'Matson Status Chip',
  description: 'A small entity state chip with configurable colors.',
});
