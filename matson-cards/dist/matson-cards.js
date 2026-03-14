/**
 * matson-cards v1.0.0
 * Custom Lovelace card library for Home Assistant
 * https://github.com/cnr-mtsn/home-assistant
 *
 * Cards included:
 *   - matson-status-chip
 *   - matson-light-card
 *   - matson-room-card
 *   - matson-header-card
 *   - matson-hero-card
 *
 * Uses Lit 3 via esm.sh CDN.
 * Register in Lovelace resources as:
 *   url: /hacsfiles/matson-cards/matson-cards.js
 *   type: module
 */

// ─── Theme injection ──────────────────────────────────────────────────────────
(function injectMatsonTheme() {
  const id = 'matson-cards-theme';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    matson-room-card, matson-light-card, matson-status-chip,
    matson-header-card, matson-hero-card {
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
})();

// ─── Lit (loaded via esm.sh CDN inside each card) ────────────────────────────
// Each card does: import { LitElement, html, css } from 'https://esm.sh/lit@3';

// ─── matson-status-chip ───────────────────────────────────────────────────────
import { LitElement as _LitElement, html as _html, css as _css } from 'https://esm.sh/lit@3';

const _chipStyles = _css`
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

class MatsonStatusChip extends _LitElement {
  static get properties() {
    return { _hass: { state: true }, _config: { state: true } };
  }
  static get styles() { return _chipStyles; }
  setConfig(config) {
    if (!config.entity) throw new Error('matson-status-chip requires an entity');
    this._config = config;
  }
  set hass(hass) { this._hass = hass; }
  getCardSize() { return 1; }
  _getColor(state) {
    if (!this._config.state_colors) return null;
    return this._config.state_colors[state] || null;
  }
  render() {
    if (!this._hass || !this._config) return _html``;
    const stateObj = this._hass.states[this._config.entity];
    const state = stateObj ? stateObj.state : 'unavailable';
    const friendlyName = stateObj?.attributes?.friendly_name || this._config.entity;
    const label = this._config.name || friendlyName;
    const icon = this._config.icon || stateObj?.attributes?.icon || 'mdi:circle';
    const color = this._getColor(state);
    const iconStyle = color ? `color: ${color};` : `color: var(--mc-icon-inactive);`;
    return _html`
      <div class="chip">
        <ha-icon .icon="${icon}" style="${iconStyle}"></ha-icon>
        <span class="label">${label}</span>
        <span class="state-text">${state}</span>
      </div>`;
  }
}
customElements.define('matson-status-chip', MatsonStatusChip);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'matson-status-chip', name: 'Matson Status Chip', description: 'A small entity state chip with configurable colors.' });

// ─── matson-light-card ────────────────────────────────────────────────────────
const _lightStyles = _css`
  :host { display: block; font-family: var(--mc-font, system-ui, sans-serif); }
  .card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px);
    padding: 16px 18px;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
    transition: background var(--mc-transition, 300ms ease),
                box-shadow var(--mc-transition, 300ms ease),
                border-color var(--mc-transition, 300ms ease);
  }
  .card.active {
    background: var(--mc-bg-active, rgba(255,220,150,0.10));
    border: var(--mc-border-active, 1px solid rgba(255,220,150,0.25));
    box-shadow: var(--mc-glow, 0 0 24px rgba(255,200,100,0.12));
  }
  .header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }
  .left { display: flex; align-items: center; gap: 10px; }
  .icon-wrap {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    transition: background var(--mc-transition, 300ms ease);
  }
  .card.active .icon-wrap { background: rgba(255,180,40,0.18); }
  .icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .card.active .icon-wrap ha-icon { color: var(--mc-icon-active, #ffb938); }
  .name { font-size: 14px; font-weight: 600; color: var(--mc-text-primary, #f0f0f0); }
  .toggle-btn {
    width: 44px; height: 26px; border-radius: 13px; border: none; cursor: pointer;
    position: relative; background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease); flex-shrink: 0; padding: 0;
  }
  .toggle-btn.on { background: var(--mc-toggle-on, #ffb938); }
  .toggle-btn::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 20px; height: 20px; border-radius: 50%; background: white;
    transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-btn.on::after { transform: translateX(18px); }
  .sliders { display: flex; flex-direction: column; gap: 10px; }
  .slider-row { display: flex; flex-direction: column; gap: 4px; }
  .slider-label { display: flex; justify-content: space-between; align-items: center; }
  .slider-label span {
    font-size: 11px; font-weight: 500;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    letter-spacing: 0.3px; text-transform: uppercase;
  }
  .slider-label .value {
    font-size: 12px; font-weight: 600; color: var(--mc-text-primary, #f0f0f0);
    text-transform: none; letter-spacing: 0;
  }
  input[type=range] {
    -webkit-appearance: none; appearance: none; width: 100%; height: 4px;
    border-radius: 4px; background: var(--mc-slider-track, rgba(255,255,255,0.12));
    outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
    border-radius: 50%; background: var(--mc-slider-thumb, #ffb938); cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4); transition: transform 150ms ease;
  }
  input[type=range]::-webkit-slider-thumb:active { transform: scale(1.2); }
  input[type=range]::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938); cursor: pointer; border: none;
  }
  .unavailable { opacity: 0.4; pointer-events: none; }
`;

class MatsonLightCard extends _LitElement {
  static get properties() {
    return { _hass: { state: true }, _config: { state: true } };
  }
  static get styles() { return _lightStyles; }
  setConfig(config) {
    if (!config.entity) throw new Error('matson-light-card requires an entity');
    this._config = config;
  }
  set hass(hass) { this._hass = hass; }
  getCardSize() { return 3; }
  _toggle() { this._hass.callService('light', 'toggle', { entity_id: this._config.entity }); }
  _setBrightness(e) {
    this._hass.callService('light', 'turn_on', {
      entity_id: this._config.entity, brightness_pct: parseInt(e.target.value, 10)
    });
  }
  _setColorTemp(e) {
    this._hass.callService('light', 'turn_on', {
      entity_id: this._config.entity, color_temp: parseInt(e.target.value, 10)
    });
  }
  render() {
    if (!this._hass || !this._config) return _html``;
    const stateObj = this._hass.states[this._config.entity];
    const unavailable = !stateObj || stateObj.state === 'unavailable';
    const isOn = stateObj?.state === 'on';
    const name = this._config.name || stateObj?.attributes?.friendly_name || this._config.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;
    const colorTemp = stateObj?.attributes?.color_temp;
    const minMireds = stateObj?.attributes?.min_mireds || 153;
    const maxMireds = stateObj?.attributes?.max_mireds || 500;
    const supportsColorTemp = stateObj?.attributes?.supported_color_modes?.includes('color_temp');
    return _html`
      <ha-card>
        <div class="card ${isOn ? 'active' : ''} ${unavailable ? 'unavailable' : ''}">
          <div class="header">
            <div class="left">
              <div class="icon-wrap"><ha-icon icon="mdi:lightbulb"></ha-icon></div>
              <span class="name">${name}</span>
            </div>
            <button class="toggle-btn ${isOn ? 'on' : ''}" @click="${this._toggle}"></button>
          </div>
          <div class="sliders">
            <div class="slider-row">
              <div class="slider-label">
                <span>Brightness</span>
                <span class="value">${isOn ? brightnessPct + '%' : 'Off'}</span>
              </div>
              <input type="range" min="1" max="100" .value="${brightnessPct}" ?disabled="${!isOn}"
                @change="${this._setBrightness}"
                style="background: linear-gradient(to right, var(--mc-slider-thumb) ${brightnessPct}%, var(--mc-slider-track) ${brightnessPct}%)" />
            </div>
            ${supportsColorTemp && colorTemp ? _html`
              <div class="slider-row">
                <div class="slider-label">
                  <span>Color Temp</span>
                  <span class="value">${colorTemp ? Math.round(1000000 / colorTemp) + 'K' : '—'}</span>
                </div>
                <input type="range" min="${minMireds}" max="${maxMireds}" .value="${colorTemp || minMireds}"
                  ?disabled="${!isOn}" @change="${this._setColorTemp}" />
              </div>` : ''}
          </div>
        </div>
      </ha-card>`;
  }
}
customElements.define('matson-light-card', MatsonLightCard);
window.customCards.push({ type: 'matson-light-card', name: 'Matson Light Card', description: 'Single light control with brightness and color temp sliders.' });

// ─── matson-room-card ─────────────────────────────────────────────────────────
const _roomStyles = _css`
  :host { display: block; font-family: var(--mc-font, system-ui, sans-serif); }
  .room-card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px); padding: 16px 18px;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none); -webkit-backdrop-filter: var(--mc-blur, none);
    transition: background var(--mc-transition, 300ms ease),
                box-shadow var(--mc-transition, 300ms ease),
                border-color var(--mc-transition, 300ms ease);
  }
  .room-card.active {
    background: var(--mc-bg-active, rgba(255,220,150,0.10));
    border: var(--mc-border-active, 1px solid rgba(255,220,150,0.25));
    box-shadow: var(--mc-glow, 0 0 24px rgba(255,200,100,0.12));
  }
  .room-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .room-left { display: flex; align-items: center; gap: 10px; }
  .room-icon-wrap {
    width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    transition: background var(--mc-transition, 300ms ease); flex-shrink: 0;
  }
  .room-card.active .room-icon-wrap { background: rgba(255,180,40,0.18); }
  .room-icon-wrap ha-icon {
    --mdc-icon-size: 22px; color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .room-card.active .room-icon-wrap ha-icon { color: var(--mc-icon-active, #ffb938); }
  .room-name { font-size: 16px; font-weight: 600; color: var(--mc-text-primary, #f0f0f0); line-height: 1.2; }
  .room-subtitle { font-size: 12px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); }
  .master-toggle { display: flex; align-items: center; gap: 8px; }
  .master-label { font-size: 12px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); }
  .toggle-btn {
    width: 44px; height: 26px; border-radius: 13px; border: none; cursor: pointer;
    position: relative; background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease); flex-shrink: 0; padding: 0;
  }
  .toggle-btn.on { background: var(--mc-toggle-on, #ffb938); }
  .toggle-btn::after {
    content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
    border-radius: 50%; background: white; transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-btn.on::after { transform: translateX(18px); }
  .divider { height: 1px; background: var(--mc-separator, rgba(255,255,255,0.08)); margin: 12px 0; }
  .lights-list { display: flex; flex-direction: column; gap: 14px; }
  .light-row { display: flex; flex-direction: column; gap: 8px; }
  .light-row-header { display: flex; align-items: center; justify-content: space-between; }
  .light-row-left { display: flex; align-items: center; gap: 8px; }
  .light-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--mc-icon-inactive, rgba(240,240,240,0.2));
    transition: background var(--mc-transition, 300ms ease), box-shadow var(--mc-transition, 300ms ease); flex-shrink: 0;
  }
  .light-dot.on { background: var(--mc-icon-active, #ffb938); box-shadow: 0 0 6px rgba(255,185,56,0.5); }
  .light-name { font-size: 13px; font-weight: 500; color: var(--mc-text-primary, #f0f0f0); }
  .light-brightness { font-size: 12px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); }
  input[type=range] {
    -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 3px;
    background: var(--mc-slider-track, rgba(255,255,255,0.12)); outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    transition: transform 150ms ease;
  }
  input[type=range]::-webkit-slider-thumb:active { transform: scale(1.2); }
  input[type=range]::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938); cursor: pointer; border: none;
  }
  .fan-row { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; }
  .fan-left { display: flex; align-items: center; gap: 8px; }
  .fan-icon ha-icon {
    --mdc-icon-size: 18px; color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    transition: color var(--mc-transition, 300ms ease);
  }
  .fan-icon.on ha-icon { color: #64b5f6; }
  .fan-name { font-size: 13px; font-weight: 500; color: var(--mc-text-primary, #f0f0f0); }
`;

class MatsonRoomCard extends _LitElement {
  static get properties() { return { _hass: { state: true }, _config: { state: true } }; }
  static get styles() { return _roomStyles; }
  setConfig(config) {
    if (!config.lights || !config.lights.length) throw new Error('matson-room-card requires lights array');
    this._config = config;
  }
  set hass(hass) { this._hass = hass; }
  getCardSize() { return 3 + Math.ceil(((this._config?.lights?.length || 0) + (this._config?.fan ? 1 : 0)) * 0.8); }
  _anyLightOn() {
    if (!this._hass || !this._config) return false;
    return this._config.lights.some(l => this._hass.states[l.entity]?.state === 'on');
  }
  _activeLightCount() {
    if (!this._hass || !this._config) return 0;
    return this._config.lights.filter(l => this._hass.states[l.entity]?.state === 'on').length;
  }
  _toggleMaster() {
    const anyOn = this._anyLightOn();
    this._hass.callService('light', anyOn ? 'turn_off' : 'turn_on', { entity_id: this._config.lights.map(l => l.entity) });
  }
  _toggleLight(entityId) { this._hass.callService('light', 'toggle', { entity_id: entityId }); }
  _setBrightness(entityId, e) { this._hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: parseInt(e.target.value, 10) }); }
  _toggleFan() { if (this._config.fan) this._hass.callService('switch', 'toggle', { entity_id: this._config.fan }); }
  _renderLight(lightCfg) {
    const stateObj = this._hass?.states[lightCfg.entity];
    const isOn = stateObj?.state === 'on';
    const name = lightCfg.name || stateObj?.attributes?.friendly_name || lightCfg.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;
    return _html`
      <div class="light-row">
        <div class="light-row-header">
          <div class="light-row-left">
            <div class="light-dot ${isOn ? 'on' : ''}"></div>
            <span class="light-name">${name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${isOn ? _html`<span class="light-brightness">${brightnessPct}%</span>` : ''}
            <button class="toggle-btn ${isOn ? 'on' : ''}" @click="${() => this._toggleLight(lightCfg.entity)}"></button>
          </div>
        </div>
        ${isOn ? _html`<input type="range" min="1" max="100" .value="${brightnessPct}"
          @change="${(e) => this._setBrightness(lightCfg.entity, e)}"
          style="background: linear-gradient(to right, var(--mc-slider-thumb) ${brightnessPct}%, var(--mc-slider-track) ${brightnessPct}%)" />` : ''}
      </div>`;
  }
  render() {
    if (!this._hass || !this._config) return _html``;
    const anyOn = this._anyLightOn();
    const activeCount = this._activeLightCount();
    const total = this._config.lights.length;
    const roomName = this._config.name || 'Room';
    const roomIcon = this._config.icon || 'mdi:home';
    const fanEntityId = this._config.fan;
    const fanState = fanEntityId ? this._hass.states[fanEntityId] : null;
    const fanOn = fanState?.state === 'on';
    const fanName = this._config.fan_name || fanState?.attributes?.friendly_name || 'Fan';
    return _html`
      <ha-card>
        <div class="room-card ${anyOn ? 'active' : ''}">
          <div class="room-header">
            <div class="room-left">
              <div class="room-icon-wrap"><ha-icon .icon="${roomIcon}"></ha-icon></div>
              <div>
                <div class="room-name">${roomName}</div>
                <div class="room-subtitle">
                  ${anyOn ? `${activeCount} of ${total} light${total !== 1 ? 's' : ''} on` : 'All lights off'}
                </div>
              </div>
            </div>
            <div class="master-toggle">
              <span class="master-label">All</span>
              <button class="toggle-btn ${anyOn ? 'on' : ''}" @click="${this._toggleMaster}"></button>
            </div>
          </div>
          <div class="divider"></div>
          <div class="lights-list">
            ${this._config.lights.map(l => this._renderLight(l))}
            ${fanEntityId ? _html`
              <div class="divider" style="margin:4px 0;"></div>
              <div class="fan-row">
                <div class="fan-left">
                  <span class="fan-icon ${fanOn ? 'on' : ''}"><ha-icon .icon="${fanOn ? 'mdi:fan' : 'mdi:fan-off'}"></ha-icon></span>
                  <span class="fan-name">${fanName}</span>
                </div>
                <button class="toggle-btn ${fanOn ? 'on' : ''}" @click="${this._toggleFan}"></button>
              </div>` : ''}
          </div>
        </div>
      </ha-card>`;
  }
}
customElements.define('matson-room-card', MatsonRoomCard);
window.customCards.push({ type: 'matson-room-card', name: 'Matson Room Card', description: 'Room overview with master toggle and individual light controls.' });

// ─── matson-header-card ───────────────────────────────────────────────────────
const _headerStyles = _css`
  :host { display: block; font-family: var(--mc-font, system-ui, sans-serif); }
  .header-card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px); padding: 18px 22px 16px;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none); -webkit-backdrop-filter: var(--mc-blur, none);
  }
  .top-row { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .time { font-size: 38px; font-weight: 300; letter-spacing: -1px; color: var(--mc-text-primary, #f0f0f0); line-height: 1; font-variant-numeric: tabular-nums; }
  .date { font-size: 14px; font-weight: 400; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); letter-spacing: 0.2px; margin-top: 4px; }
  .persons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; align-self: flex-start; padding-top: 4px; }
  .person-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px 6px 8px;
    border-radius: 999px; background: var(--mc-chip-bg, rgba(255,255,255,0.07));
    border: var(--mc-chip-border, 1px solid rgba(255,255,255,0.1));
    backdrop-filter: var(--mc-blur, none); -webkit-backdrop-filter: var(--mc-blur, none);
    transition: background var(--mc-transition, 300ms ease), border-color var(--mc-transition, 300ms ease);
  }
  .person-chip.home { background: rgba(80,200,120,0.12); border-color: rgba(80,200,120,0.28); }
  .person-chip ha-icon { --mdc-icon-size: 16px; color: var(--mc-icon-inactive, rgba(240,240,240,0.4)); transition: color var(--mc-transition, 300ms ease); }
  .person-chip.home ha-icon { color: #50c878; }
  .person-name { font-size: 12px; font-weight: 600; color: var(--mc-text-primary, #f0f0f0); white-space: nowrap; }
  .person-state { font-size: 11px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); white-space: nowrap; }
  .separator { height: 1px; background: var(--mc-separator, rgba(255,255,255,0.08)); margin-top: 16px; border-radius: 1px; }
`;

const _DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const _MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

class MatsonHeaderCard extends _LitElement {
  static get properties() { return { _hass: { state: true }, _config: { state: true }, _time: { state: true }, _date: { state: true } }; }
  static get styles() { return _headerStyles; }
  constructor() { super(); this._tick = this._tick.bind(this); }
  connectedCallback() { super.connectedCallback(); this._tick(); this._interval = setInterval(this._tick, 1000); }
  disconnectedCallback() { super.disconnectedCallback(); clearInterval(this._interval); }
  _tick() {
    const now = new Date();
    let h = now.getHours(); const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    this._time = `${h}:${m} ${ampm}`;
    this._date = `${_DAYS[now.getDay()]}, ${_MONTHS[now.getMonth()]} ${now.getDate()}`;
  }
  setConfig(config) { this._config = config; }
  set hass(hass) { this._hass = hass; }
  getCardSize() { return 2; }
  _renderPerson(personCfg) {
    if (!this._hass) return _html``;
    const stateObj = this._hass.states[personCfg.entity];
    const state = stateObj?.state || 'unknown';
    const isHome = state === 'home';
    const icon = personCfg.icon || (isHome ? 'mdi:account' : 'mdi:account-arrow-right');
    const name = personCfg.name || stateObj?.attributes?.friendly_name || personCfg.entity;
    return _html`
      <div class="person-chip ${isHome ? 'home' : ''}">
        <ha-icon .icon="${icon}"></ha-icon>
        <span class="person-name">${name}</span>
        <span class="person-state">${state}</span>
      </div>`;
  }
  render() {
    if (!this._config) return _html``;
    const persons = this._config.persons || [];
    return _html`
      <ha-card>
        <div class="header-card">
          <div class="top-row">
            <div>
              <div class="time">${this._time}</div>
              <div class="date">${this._date}</div>
            </div>
            <div class="persons">${persons.map(p => this._renderPerson(p))}</div>
          </div>
          <div class="separator"></div>
        </div>
      </ha-card>`;
  }
}
customElements.define('matson-header-card', MatsonHeaderCard);
window.customCards.push({ type: 'matson-header-card', name: 'Matson Header Card', description: 'Full-width dashboard header with time, date, and person presence.' });

// ─── matson-hero-card ─────────────────────────────────────────────────────────
const _heroStyles = _css`
  :host { display: block; font-family: var(--mc-font, system-ui, sans-serif); }
  .hero-card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px); overflow: hidden;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none); -webkit-backdrop-filter: var(--mc-blur, none);
    transition: box-shadow var(--mc-transition, 300ms ease), border-color var(--mc-transition, 300ms ease);
    position: relative;
  }
  .ambient-glow {
    position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
    transition: opacity var(--mc-transition, 300ms ease);
    background: radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.14) 0%, transparent 70%);
    opacity: 0; z-index: 0;
  }
  .hero-card.glow-low .ambient-glow { opacity: 0.4; }
  .hero-card.glow-mid .ambient-glow { opacity: 0.7; }
  .hero-card.glow-high .ambient-glow { opacity: 1; }
  .hero-card.glow-low  { border-color: rgba(255,200,80,0.15); }
  .hero-card.glow-mid  { border-color: rgba(255,200,80,0.25); }
  .hero-card.glow-high { border-color: rgba(255,200,80,0.38); box-shadow: var(--mc-glow, 0 0 36px rgba(255,200,100,0.18)); }
  .hero-inner { position: relative; z-index: 1; }
  .hero-title-bar { padding: 18px 20px 12px; display: flex; align-items: center; justify-content: space-between; }
  .hero-title { font-size: 20px; font-weight: 700; color: var(--mc-text-primary, #f0f0f0); letter-spacing: -0.3px; }
  .hero-summary { font-size: 12px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); padding-top: 2px; }
  .hero-global-toggle { display: flex; align-items: center; gap: 8px; }
  .hero-global-label { font-size: 12px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); }
  .rooms-list { padding: 0 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .room-section {
    border-radius: var(--mc-radius-inner, 10px); background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    transition: background var(--mc-transition, 300ms ease), border-color var(--mc-transition, 300ms ease);
  }
  .room-section.active { background: rgba(255,200,80,0.07); border-color: rgba(255,200,80,0.20); }
  .room-header {
    display: flex; align-items: center; justify-content: space-between; padding: 11px 14px;
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .room-header:active { opacity: 0.75; }
  .room-left { display: flex; align-items: center; gap: 10px; }
  .room-icon-wrap {
    width: 34px; height: 34px; border-radius: 9px; background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: background var(--mc-transition, 300ms ease);
  }
  .room-section.active .room-icon-wrap { background: rgba(255,180,40,0.16); }
  .room-icon-wrap ha-icon { --mdc-icon-size: 18px; color: var(--mc-icon-inactive, rgba(240,240,240,0.4)); transition: color var(--mc-transition, 300ms ease); }
  .room-section.active .room-icon-wrap ha-icon { color: var(--mc-icon-active, #ffb938); }
  .room-name { font-size: 14px; font-weight: 600; color: var(--mc-text-primary, #f0f0f0); }
  .room-count { font-size: 11px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); }
  .room-right { display: flex; align-items: center; gap: 10px; }
  .light-pips { display: flex; gap: 3px; align-items: center; }
  .pip {
    width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.12);
    transition: background var(--mc-transition, 300ms ease), box-shadow var(--mc-transition, 300ms ease);
  }
  .pip.on { background: #ffb938; box-shadow: 0 0 5px rgba(255,185,56,0.6); }
  .chevron { --mdc-icon-size: 16px; color: var(--mc-text-secondary, rgba(240,240,240,0.4)); transition: transform var(--mc-transition, 300ms ease); flex-shrink: 0; }
  .room-section.expanded .chevron { transform: rotate(180deg); }
  .toggle-btn {
    width: 40px; height: 23px; border-radius: 12px; border: none; cursor: pointer;
    position: relative; background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease); flex-shrink: 0; padding: 0;
  }
  .toggle-btn.on { background: var(--mc-toggle-on, #ffb938); }
  .toggle-btn::after {
    content: ''; position: absolute; top: 2.5px; left: 2.5px; width: 18px; height: 18px;
    border-radius: 50%; background: white; transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-btn.on::after { transform: translateX(17px); }
  .expand-panel {
    display: none; padding: 0 14px 14px; flex-direction: column; gap: 12px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .room-section.expanded .expand-panel { display: flex; }
  .light-control-row { display: flex; flex-direction: column; gap: 6px; }
  .light-ctrl-header { display: flex; align-items: center; justify-content: space-between; }
  .light-ctrl-left { display: flex; align-items: center; gap: 7px; }
  .ctrl-dot {
    width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.18); flex-shrink: 0;
    transition: background var(--mc-transition, 300ms ease), box-shadow var(--mc-transition, 300ms ease);
  }
  .ctrl-dot.on { background: #ffb938; box-shadow: 0 0 5px rgba(255,185,56,0.5); }
  .ctrl-name { font-size: 12px; font-weight: 500; color: var(--mc-text-primary, #f0f0f0); }
  .ctrl-right { display: flex; align-items: center; gap: 7px; }
  .ctrl-brightness { font-size: 11px; color: var(--mc-text-secondary, rgba(240,240,240,0.55)); min-width: 28px; text-align: right; }
  .toggle-sm {
    width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer;
    position: relative; background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease); flex-shrink: 0; padding: 0;
  }
  .toggle-sm.on { background: var(--mc-toggle-on, #ffb938); }
  .toggle-sm::after {
    content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
    border-radius: 50%; background: white; transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .toggle-sm.on::after { transform: translateX(16px); }
  input[type=range] {
    -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 3px;
    background: var(--mc-slider-track, rgba(255,255,255,0.12)); outline: none; cursor: pointer;
    transition: opacity var(--mc-transition, 300ms ease);
  }
  input[type=range]:disabled { opacity: 0.3; pointer-events: none; }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938); cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4); transition: transform 150ms ease;
  }
  input[type=range]::-webkit-slider-thumb:active { transform: scale(1.25); }
  input[type=range]::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--mc-slider-thumb, #ffb938); cursor: pointer; border: none;
  }
  .fan-ctrl-row { display: flex; align-items: center; justify-content: space-between; padding-top: 2px; border-top: 1px solid rgba(255,255,255,0.05); }
  .fan-ctrl-left { display: flex; align-items: center; gap: 7px; }
  .fan-ctrl-left ha-icon { --mdc-icon-size: 16px; color: var(--mc-icon-inactive, rgba(240,240,240,0.4)); transition: color var(--mc-transition, 300ms ease); }
  .fan-ctrl-row.fan-on ha-icon { color: #64b5f6; }
  .fan-ctrl-name { font-size: 12px; font-weight: 500; color: var(--mc-text-primary, #f0f0f0); }
`;

class MatsonHeroCard extends _LitElement {
  static get properties() { return { _hass: { state: true }, _config: { state: true }, _expanded: { state: true } }; }
  static get styles() { return _heroStyles; }
  constructor() { super(); this._expanded = {}; }
  setConfig(config) {
    if (!config.rooms || !config.rooms.length) throw new Error('matson-hero-card requires at least one room');
    this._config = config;
  }
  set hass(hass) { this._hass = hass; }
  getCardSize() { return 4 + (this._config?.rooms?.length || 0); }
  _getLightsState(room) {
    if (!this._hass) return { on: 0, total: 0 };
    const on = (room.lights || []).filter(l => this._hass.states[l.entity]?.state === 'on').length;
    return { on, total: (room.lights || []).length };
  }
  _globalLightsOn() {
    if (!this._hass || !this._config) return { on: 0, total: 0 };
    let on = 0, total = 0;
    this._config.rooms.forEach(r => { const s = this._getLightsState(r); on += s.on; total += s.total; });
    return { on, total };
  }
  _glowClass(on, total) {
    if (total === 0 || on === 0) return '';
    const r = on / total;
    return r <= 0.33 ? 'glow-low' : r <= 0.66 ? 'glow-mid' : 'glow-high';
  }
  _toggleRoom(idx) {
    const room = this._config.rooms[idx];
    const { on } = this._getLightsState(room);
    this._hass.callService('light', on > 0 ? 'turn_off' : 'turn_on', { entity_id: room.lights.map(l => l.entity) });
  }
  _toggleLight(entityId, e) { e.stopPropagation(); this._hass.callService('light', 'toggle', { entity_id: entityId }); }
  _setBrightness(entityId, e) { e.stopPropagation(); this._hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: parseInt(e.target.value, 10) }); }
  _toggleFan(entityId, e) { e.stopPropagation(); this._hass.callService('switch', 'toggle', { entity_id: entityId }); }
  _toggleExpand(idx, e) { e.stopPropagation(); this._expanded = { ...this._expanded, [idx]: !this._expanded[idx] }; }
  _toggleMasterAll(e) {
    e.stopPropagation();
    const { on } = this._globalLightsOn();
    const all = this._config.rooms.flatMap(r => r.lights.map(l => l.entity));
    this._hass.callService('light', on > 0 ? 'turn_off' : 'turn_on', { entity_id: all });
  }
  _renderLightControl(lightCfg) {
    const stateObj = this._hass?.states[lightCfg.entity];
    const isOn = stateObj?.state === 'on';
    const name = lightCfg.name || stateObj?.attributes?.friendly_name || lightCfg.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;
    return _html`
      <div class="light-control-row">
        <div class="light-ctrl-header">
          <div class="light-ctrl-left">
            <div class="ctrl-dot ${isOn ? 'on' : ''}"></div>
            <span class="ctrl-name">${name}</span>
          </div>
          <div class="ctrl-right">
            ${isOn ? _html`<span class="ctrl-brightness">${brightnessPct}%</span>` : ''}
            <button class="toggle-sm ${isOn ? 'on' : ''}" @click="${(e) => this._toggleLight(lightCfg.entity, e)}"></button>
          </div>
        </div>
        ${isOn ? _html`<input type="range" min="1" max="100" .value="${brightnessPct}"
          @change="${(e) => this._setBrightness(lightCfg.entity, e)}"
          style="background: linear-gradient(to right, var(--mc-slider-thumb) ${brightnessPct}%, var(--mc-slider-track) ${brightnessPct}%)" />` : ''}
      </div>`;
  }
  _renderRoom(room, idx) {
    const { on, total } = this._getLightsState(room);
    const isActive = on > 0;
    const isExpanded = !!this._expanded[idx];
    const fanEntityId = room.fan;
    const fanState = fanEntityId ? this._hass?.states[fanEntityId] : null;
    const fanOn = fanState?.state === 'on';
    const fanName = room.fan_name || fanState?.attributes?.friendly_name || 'Fan';
    const pips = (room.lights || []).map(l => this._hass?.states[l.entity]?.state === 'on');
    return _html`
      <div class="room-section ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}">
        <div class="room-header" @click="${(e) => this._toggleExpand(idx, e)}">
          <div class="room-left">
            <div class="room-icon-wrap"><ha-icon .icon="${room.icon || 'mdi:home'}"></ha-icon></div>
            <div>
              <div class="room-name">${room.name || 'Room'}</div>
              <div class="room-count">${isActive ? `${on}/${total} on` : `${total} light${total !== 1 ? 's' : ''}`}</div>
            </div>
          </div>
          <div class="room-right">
            <div class="light-pips">${pips.map(isOn => _html`<div class="pip ${isOn ? 'on' : ''}"></div>`)}</div>
            <button class="toggle-btn ${isActive ? 'on' : ''}" @click="${(e) => { e.stopPropagation(); this._toggleRoom(idx); }}"></button>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>
        <div class="expand-panel">
          ${(room.lights || []).map(l => this._renderLightControl(l))}
          ${fanEntityId ? _html`
            <div class="fan-ctrl-row ${fanOn ? 'fan-on' : ''}">
              <div class="fan-ctrl-left">
                <ha-icon .icon="${fanOn ? 'mdi:fan' : 'mdi:fan-off'}"></ha-icon>
                <span class="fan-ctrl-name">${fanName}</span>
              </div>
              <button class="toggle-sm ${fanOn ? 'on' : ''}" @click="${(e) => this._toggleFan(fanEntityId, e)}"></button>
            </div>` : ''}
        </div>
      </div>`;
  }
  render() {
    if (!this._hass || !this._config) return _html``;
    const { on: globalOn, total: globalTotal } = this._globalLightsOn();
    const glowClass = this._glowClass(globalOn, globalTotal);
    const title = this._config.title || 'Home Overview';
    const anyOn = globalOn > 0;
    return _html`
      <ha-card>
        <div class="hero-card ${glowClass}">
          <div class="ambient-glow"></div>
          <div class="hero-inner">
            <div class="hero-title-bar">
              <div>
                <div class="hero-title">${title}</div>
                <div class="hero-summary">${anyOn ? `${globalOn} light${globalOn !== 1 ? 's' : ''} on across ${this._config.rooms.length} rooms` : 'All lights off'}</div>
              </div>
              <div class="hero-global-toggle">
                <span class="hero-global-label">All</span>
                <button class="toggle-btn ${anyOn ? 'on' : ''}" @click="${this._toggleMasterAll}"></button>
              </div>
            </div>
            <div class="rooms-list">${this._config.rooms.map((room, idx) => this._renderRoom(room, idx))}</div>
          </div>
        </div>
      </ha-card>`;
  }
}
customElements.define('matson-hero-card', MatsonHeroCard);
window.customCards.push({ type: 'matson-hero-card', name: 'Matson Hero Card', description: 'Showpiece overview card — all rooms with expandable light controls and ambient glow.' });

// ─── Done ─────────────────────────────────────────────────────────────────────
console.info(
  '%c MATSON-CARDS %c v1.0.0 loaded ',
  'color: #ffb938; background: #111; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;',
  'background: #222; padding: 2px 4px; border-radius: 0 4px 4px 0;'
);
