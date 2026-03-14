/**
 * matson-light-card
 * Single light control with on/off, brightness slider, and color temp slider.
 *
 * Config:
 *   entity: string            — light entity ID
 *   name: string              — optional override name
 *   style: "monochrome" | "liquid-glass"
 */
import { LitElement, html, css } from 'https://esm.sh/lit@3';

const baseStyles = css`
  :host {
    display: block;
    font-family: var(--mc-font, system-ui, sans-serif);
  }
  .card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px);
    padding: 16px 18px;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
    transition:
      background var(--mc-transition, 300ms ease),
      box-shadow var(--mc-transition, 300ms ease),
      border-color var(--mc-transition, 300ms ease);
  }
  .card.active {
    background: var(--mc-bg-active, rgba(255,220,150,0.10));
    border: var(--mc-border-active, 1px solid rgba(255,220,150,0.25));
    box-shadow: var(--mc-glow, 0 0 24px rgba(255,200,100,0.12));
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--mc-transition, 300ms ease);
  }
  .card.active .icon-wrap {
    background: rgba(255, 180, 40, 0.18);
  }
  .icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .card.active .icon-wrap ha-icon {
    color: var(--mc-icon-active, #ffb938);
  }
  .name {
    font-size: 14px;
    font-weight: 600;
    color: var(--mc-text-primary, #f0f0f0);
  }
  .toggle-btn {
    width: 44px;
    height: 26px;
    border-radius: 13px;
    border: none;
    cursor: pointer;
    position: relative;
    background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease);
    flex-shrink: 0;
    padding: 0;
  }
  .toggle-btn.on {
    background: var(--mc-toggle-on, #ffb938);
  }
  .toggle-btn::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-btn.on::after {
    transform: translateX(18px);
  }
  .sliders {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .slider-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .slider-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .slider-label span {
    font-size: 11px;
    font-weight: 500;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .slider-label .value {
    font-size: 12px;
    font-weight: 600;
    color: var(--mc-text-primary, #f0f0f0);
    text-transform: none;
    letter-spacing: 0;
  }
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: var(--mc-slider-track, rgba(255,255,255,0.12));
    outline: none;
    cursor: pointer;
    transition: background var(--mc-transition, 300ms ease);
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    transition: transform 150ms ease;
  }
  input[type=range]::-webkit-slider-thumb:active {
    transform: scale(1.2);
  }
  input[type=range]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938);
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .unavailable {
    opacity: 0.4;
    pointer-events: none;
  }
`;

class MatsonLightCard extends LitElement {
  static get properties() {
    return {
      _hass: { state: true },
      _config: { state: true },
    };
  }

  static get styles() { return baseStyles; }

  setConfig(config) {
    if (!config.entity) throw new Error('matson-light-card requires an entity');
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() { return 3; }

  _toggle() {
    this._hass.callService('light', 'toggle', { entity_id: this._config.entity });
  }

  _setBrightness(e) {
    const pct = parseInt(e.target.value, 10);
    this._hass.callService('light', 'turn_on', {
      entity_id: this._config.entity,
      brightness_pct: pct,
    });
  }

  _setColorTemp(e) {
    const mireds = parseInt(e.target.value, 10);
    this._hass.callService('light', 'turn_on', {
      entity_id: this._config.entity,
      color_temp: mireds,
    });
  }

  render() {
    if (!this._hass || !this._config) return html``;
    const stateObj = this._hass.states[this._config.entity];
    const unavailable = !stateObj || stateObj.state === 'unavailable';
    const isOn = stateObj?.state === 'on';
    const name = this._config.name || stateObj?.attributes?.friendly_name || this._config.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;
    const colorTemp = stateObj?.attributes?.color_temp;
    const minMireds = stateObj?.attributes?.min_mireds || 153;
    const maxMireds = stateObj?.attributes?.max_mireds || 500;
    const supportsColorTemp = !!stateObj?.attributes?.color_temp_kelvin !== undefined
      || stateObj?.attributes?.supported_color_modes?.includes('color_temp');

    return html`
      <ha-card>
        <div class="card ${isOn ? 'active' : ''} ${unavailable ? 'unavailable' : ''}">
          <div class="header">
            <div class="left">
              <div class="icon-wrap">
                <ha-icon icon="mdi:lightbulb"></ha-icon>
              </div>
              <span class="name">${name}</span>
            </div>
            <button
              class="toggle-btn ${isOn ? 'on' : ''}"
              @click="${this._toggle}"
              title="${isOn ? 'Turn off' : 'Turn on'}"
            ></button>
          </div>

          <div class="sliders">
            <div class="slider-row">
              <div class="slider-label">
                <span>Brightness</span>
                <span class="value">${isOn ? brightnessPct + '%' : 'Off'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                .value="${brightnessPct}"
                ?disabled="${!isOn}"
                @change="${this._setBrightness}"
                style="background: linear-gradient(to right, var(--mc-slider-thumb) ${brightnessPct}%, var(--mc-slider-track) ${brightnessPct}%)"
              />
            </div>

            ${supportsColorTemp && colorTemp ? html`
              <div class="slider-row">
                <div class="slider-label">
                  <span>Color Temp</span>
                  <span class="value">${colorTemp ? Math.round(1000000 / colorTemp) + 'K' : '—'}</span>
                </div>
                <input
                  type="range"
                  min="${minMireds}"
                  max="${maxMireds}"
                  .value="${colorTemp || minMireds}"
                  ?disabled="${!isOn}"
                  @change="${this._setColorTemp}"
                />
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define('matson-light-card', MatsonLightCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'matson-light-card',
  name: 'Matson Light Card',
  description: 'Single light control with brightness and color temp sliders.',
});
