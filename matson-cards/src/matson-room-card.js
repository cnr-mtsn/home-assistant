/**
 * matson-room-card
 * Room overview with master toggle, individual light controls, and optional fan/switch.
 *
 * Config:
 *   name: string                        — room name
 *   icon: string                        — MDI icon
 *   lights:                             — list of light entities
 *     - entity: light.example
 *       name: "Lamp"                    — optional
 *   fan: switch.fan_socket_1            — optional fan/switch entity
 *   fan_name: "Fan"                     — optional
 *   style: "monochrome" | "liquid-glass"
 */
import { LitElement, html, css } from 'https://esm.sh/lit@3';

const baseStyles = css`
  :host {
    display: block;
    font-family: var(--mc-font, system-ui, sans-serif);
  }
  .room-card {
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
  .room-card.active {
    background: var(--mc-bg-active, rgba(255,220,150,0.10));
    border: var(--mc-border-active, 1px solid rgba(255,220,150,0.25));
    box-shadow: var(--mc-glow, 0 0 24px rgba(255,200,100,0.12));
  }
  .room-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .room-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .room-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--mc-transition, 300ms ease);
    flex-shrink: 0;
  }
  .room-card.active .room-icon-wrap {
    background: rgba(255, 180, 40, 0.18);
  }
  .room-icon-wrap ha-icon {
    --mdc-icon-size: 22px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .room-card.active .room-icon-wrap ha-icon {
    color: var(--mc-icon-active, #ffb938);
  }
  .room-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .room-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--mc-text-primary, #f0f0f0);
    line-height: 1.2;
  }
  .room-subtitle {
    font-size: 12px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
  }
  .master-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .master-label {
    font-size: 12px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
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
  .divider {
    height: 1px;
    background: var(--mc-separator, rgba(255,255,255,0.08));
    margin: 12px 0;
  }
  .lights-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .light-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .light-row-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .light-row-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .light-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mc-icon-inactive, rgba(240,240,240,0.2));
    transition: background var(--mc-transition, 300ms ease);
    flex-shrink: 0;
  }
  .light-dot.on {
    background: var(--mc-icon-active, #ffb938);
    box-shadow: 0 0 6px rgba(255,185,56,0.5);
  }
  .light-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--mc-text-primary, #f0f0f0);
  }
  .light-brightness {
    font-size: 12px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
  }
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: transparent;
    outline: none;
    cursor: pointer;
    margin: 6px 0 2px;
    padding: 0;
  }
  input[type=range]:disabled {
    opacity: 0.35;
    pointer-events: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.15);
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffb938;
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    transition: transform 150ms ease;
  }
  input[type=range]::-webkit-slider-thumb:active {
    transform: scale(1.3);
  }
  input[type=range]::-moz-range-track {
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.15);
  }
  input[type=range]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffb938;
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
  }
  .fan-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 4px;
  }
  .fan-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .fan-icon ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    transition: color var(--mc-transition, 300ms ease);
  }
  .fan-icon.on ha-icon {
    color: #64b5f6;
  }
  .fan-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--mc-text-primary, #f0f0f0);
  }
`;

class MatsonRoomCard extends LitElement {
  static get properties() {
    return {
      _hass: { state: true },
      _config: { state: true },
    };
  }

  static get styles() { return baseStyles; }

  setConfig(config) {
    if (!config.lights || !config.lights.length) {
      throw new Error('matson-room-card requires at least one light in the lights array');
    }
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    const rows = (this._config?.lights?.length || 0) + (this._config?.fan ? 1 : 0);
    return 3 + Math.ceil(rows * 0.8);
  }

  _anyLightOn() {
    if (!this._hass || !this._config) return false;
    return this._config.lights.some(l => {
      const s = this._hass.states[l.entity];
      return s && s.state === 'on';
    });
  }

  _activeLightCount() {
    if (!this._hass || !this._config) return 0;
    return this._config.lights.filter(l => {
      const s = this._hass.states[l.entity];
      return s && s.state === 'on';
    }).length;
  }

  _toggleMaster() {
    const anyOn = this._anyLightOn();
    const entities = this._config.lights.map(l => l.entity);
    this._hass.callService('light', anyOn ? 'turn_off' : 'turn_on', {
      entity_id: entities,
    });
  }

  _toggleLight(entityId) {
    this._hass.callService('light', 'toggle', { entity_id: entityId });
  }

  _setBrightness(entityId, e) {
    this._hass.callService('light', 'turn_on', {
      entity_id: entityId,
      brightness_pct: parseInt(e.target.value, 10),
    });
  }

  _toggleFan() {
    if (!this._config.fan) return;
    this._hass.callService('switch', 'toggle', { entity_id: this._config.fan });
  }

  _renderLight(lightCfg) {
    const stateObj = this._hass?.states[lightCfg.entity];
    const isOn = stateObj?.state === 'on';
    const name = lightCfg.name || stateObj?.attributes?.friendly_name || lightCfg.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;

    return html`
      <div class="light-row">
        <div class="light-row-header">
          <div class="light-row-left">
            <div class="light-dot ${isOn ? 'on' : ''}"></div>
            <span class="light-name">${name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${isOn ? html`<span class="light-brightness">${brightnessPct}%</span>` : ''}
            <button
              class="toggle-btn ${isOn ? 'on' : ''}"
              @click="${() => this._toggleLight(lightCfg.entity)}"
            ></button>
          </div>
        </div>
        ${isOn ? html`
          <input
            type="range"
            min="1"
            max="100"
            .value="${brightnessPct}"
            @change="${(e) => this._setBrightness(lightCfg.entity, e)}"
            style="background: linear-gradient(to right, var(--mc-slider-thumb) ${brightnessPct}%, var(--mc-slider-track) ${brightnessPct}%)"
          />
        ` : ''}
      </div>
    `;
  }

  render() {
    if (!this._hass || !this._config) return html``;
    const anyOn = this._anyLightOn();
    const activeCount = this._activeLightCount();
    const total = this._config.lights.length;
    const roomName = this._config.name || 'Room';
    const roomIcon = this._config.icon || 'mdi:home';

    const fanEntityId = this._config.fan;
    const fanState = fanEntityId ? this._hass.states[fanEntityId] : null;
    const fanOn = fanState?.state === 'on';
    const fanName = this._config.fan_name || fanState?.attributes?.friendly_name || 'Fan';

    return html`
      <ha-card>
        <div class="room-card ${anyOn ? 'active' : ''}">
          <div class="room-header">
            <div class="room-left">
              <div class="room-icon-wrap">
                <ha-icon .icon="${roomIcon}"></ha-icon>
              </div>
              <div class="room-info">
                <span class="room-name">${roomName}</span>
                <span class="room-subtitle">
                  ${anyOn ? `${activeCount} of ${total} light${total !== 1 ? 's' : ''} on` : 'All lights off'}
                </span>
              </div>
            </div>
            <div class="master-toggle">
              <span class="master-label">All</span>
              <button
                class="toggle-btn ${anyOn ? 'on' : ''}"
                @click="${this._toggleMaster}"
              ></button>
            </div>
          </div>

          <div class="divider"></div>

          <div class="lights-list">
            ${this._config.lights.map(l => this._renderLight(l))}

            ${fanEntityId ? html`
              <div class="divider" style="margin:4px 0;"></div>
              <div class="fan-row">
                <div class="fan-left">
                  <span class="fan-icon ${fanOn ? 'on' : ''}">
                    <ha-icon icon="mdi:fan${fanOn ? '' : '-off'}"></ha-icon>
                  </span>
                  <span class="fan-name">${fanName}</span>
                </div>
                <button
                  class="toggle-btn ${fanOn ? 'on' : ''}"
                  @click="${this._toggleFan}"
                ></button>
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define('matson-room-card', MatsonRoomCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'matson-room-card',
  name: 'Matson Room Card',
  description: 'Room overview with master toggle and individual light controls.',
});
