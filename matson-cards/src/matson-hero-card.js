/**
 * matson-hero-card
 * The showpiece overview card — all rooms at a glance with expandable controls
 * and ambient glow based on how many lights are on.
 *
 * Config:
 *   title: string                 — optional header title
 *   style: "monochrome" | "liquid-glass"
 *   rooms:
 *     - name: "Master Bedroom"
 *       icon: "mdi:bed"
 *       lights:
 *         - entity: light.dresser
 *           name: Dresser
 *         - entity: light.conners_nightstand
 *           name: Conner's Side
 *         - entity: light.sink_light
 *           name: Rayne's Side
 *       fan: switch.fan_socket_1
 *       fan_name: Fan
 *     - name: "Office"
 *       icon: "mdi:desk"
 *       lights:
 *         - entity: light.left_floor_lamp
 *         - entity: light.right_floor_lamp
 */
import { LitElement, html, css } from 'https://esm.sh/lit@3';

const baseStyles = css`
  :host {
    display: block;
    font-family: var(--mc-font, system-ui, sans-serif);
  }

  /* ── Outer hero shell ─────────────────────────────────────── */
  .hero-card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px);
    overflow: hidden;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
    transition:
      box-shadow var(--mc-transition, 300ms ease),
      border-color var(--mc-transition, 300ms ease);
    position: relative;
  }

  /* ambient glow overlay — intensity scales with lights-on ratio */
  .ambient-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    transition: opacity var(--mc-transition, 300ms ease);
    background: radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.14) 0%, transparent 70%);
    opacity: 0;
    z-index: 0;
  }

  .hero-card.glow-low  .ambient-glow { opacity: 0.4; }
  .hero-card.glow-mid  .ambient-glow { opacity: 0.7; }
  .hero-card.glow-high .ambient-glow { opacity: 1; }

  /* border glow on active */
  .hero-card.glow-low  { border-color: rgba(255,200,80,0.15); }
  .hero-card.glow-mid  { border-color: rgba(255,200,80,0.25); }
  .hero-card.glow-high {
    border-color: rgba(255,200,80,0.38);
    box-shadow: var(--mc-glow, 0 0 36px rgba(255,200,100,0.18));
  }

  .hero-inner {
    position: relative;
    z-index: 1;
  }

  /* ── Hero title bar ───────────────────────────────────────── */
  .hero-title-bar {
    padding: 18px 20px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .hero-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--mc-text-primary, #f0f0f0);
    letter-spacing: -0.3px;
  }
  .hero-summary {
    font-size: 12px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    padding-top: 2px;
  }
  .hero-global-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hero-global-label {
    font-size: 12px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
  }

  /* ── Room sections ────────────────────────────────────────── */
  .rooms-list {
    padding: 0 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .room-section {
    border-radius: var(--mc-radius-inner, 10px);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    transition:
      background var(--mc-transition, 300ms ease),
      border-color var(--mc-transition, 300ms ease);
  }
  .room-section.active {
    background: rgba(255, 200, 80, 0.07);
    border-color: rgba(255, 200, 80, 0.20);
  }

  /* room header row — always visible, tappable */
  .room-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .room-header:active {
    opacity: 0.75;
  }
  .room-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .room-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background var(--mc-transition, 300ms ease);
  }
  .room-section.active .room-icon-wrap {
    background: rgba(255, 180, 40, 0.16);
  }
  .room-icon-wrap ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .room-section.active .room-icon-wrap ha-icon {
    color: var(--mc-icon-active, #ffb938);
  }
  .room-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .room-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--mc-text-primary, #f0f0f0);
  }
  .room-count {
    font-size: 11px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
  }
  .room-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* light count pips */
  .light-pips {
    display: flex;
    gap: 3px;
    align-items: center;
  }
  .pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    transition: background var(--mc-transition, 300ms ease), box-shadow var(--mc-transition, 300ms ease);
  }
  .pip.on {
    background: #ffb938;
    box-shadow: 0 0 5px rgba(255,185,56,0.6);
  }

  .chevron {
    --mdc-icon-size: 16px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.4));
    transition: transform var(--mc-transition, 300ms ease), color var(--mc-transition, 300ms ease);
    flex-shrink: 0;
  }
  .room-section.expanded .chevron {
    transform: rotate(180deg);
  }

  /* master toggle */
  .toggle-btn {
    width: 40px;
    height: 23px;
    border-radius: 12px;
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
    top: 2.5px;
    left: 2.5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-btn.on::after {
    transform: translateX(17px);
  }

  /* ── Expanded controls panel ──────────────────────────────── */
  .expand-panel {
    display: none;
    padding: 0 14px 14px;
    flex-direction: column;
    gap: 12px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .room-section.expanded .expand-panel {
    display: flex;
  }

  .light-control-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .light-ctrl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .light-ctrl-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ctrl-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    flex-shrink: 0;
    transition: background var(--mc-transition, 300ms ease), box-shadow var(--mc-transition, 300ms ease);
  }
  .ctrl-dot.on {
    background: #ffb938;
    box-shadow: 0 0 5px rgba(255,185,56,0.5);
  }
  .ctrl-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--mc-text-primary, #f0f0f0);
  }
  .ctrl-right {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ctrl-brightness {
    font-size: 11px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    min-width: 28px;
    text-align: right;
  }
  .toggle-sm {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    position: relative;
    background: var(--mc-toggle-off, rgba(255,255,255,0.15));
    transition: background var(--mc-transition, 300ms ease);
    flex-shrink: 0;
    padding: 0;
  }
  .toggle-sm.on {
    background: var(--mc-toggle-on, #ffb938);
  }
  .toggle-sm::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform var(--mc-transition, 300ms ease);
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .toggle-sm.on::after {
    transform: translateX(16px);
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

  /* fan row in expand panel */
  .fan-ctrl-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 2px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .fan-ctrl-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .fan-ctrl-left ha-icon {
    --mdc-icon-size: 16px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .fan-ctrl-row.fan-on ha-icon {
    color: #64b5f6;
  }
  .fan-ctrl-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--mc-text-primary, #f0f0f0);
  }
`;

class MatsonHeroCard extends LitElement {
  static get properties() {
    return {
      _hass: { state: true },
      _config: { state: true },
      _expanded: { state: true },
    };
  }

  static get styles() { return baseStyles; }

  constructor() {
    super();
    this._expanded = {};
  }

  setConfig(config) {
    if (!config.rooms || !config.rooms.length) {
      throw new Error('matson-hero-card requires at least one room');
    }
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 4 + (this._config?.rooms?.length || 0);
  }

  _getLightsState(room) {
    if (!this._hass) return { on: 0, total: 0 };
    const lights = room.lights || [];
    const on = lights.filter(l => this._hass.states[l.entity]?.state === 'on').length;
    return { on, total: lights.length };
  }

  _globalLightsOn() {
    if (!this._hass || !this._config) return { on: 0, total: 0 };
    let on = 0, total = 0;
    this._config.rooms.forEach(room => {
      const { on: rOn, total: rTotal } = this._getLightsState(room);
      on += rOn;
      total += rTotal;
    });
    return { on, total };
  }

  _glowClass(on, total) {
    if (total === 0 || on === 0) return '';
    const ratio = on / total;
    if (ratio <= 0.33) return 'glow-low';
    if (ratio <= 0.66) return 'glow-mid';
    return 'glow-high';
  }

  _toggleRoom(roomIdx) {
    const room = this._config.rooms[roomIdx];
    const { on } = this._getLightsState(room);
    const entities = room.lights.map(l => l.entity);
    this._hass.callService('light', on > 0 ? 'turn_off' : 'turn_on', { entity_id: entities });
  }

  _toggleLight(entityId, e) {
    e.stopPropagation();
    this._hass.callService('light', 'toggle', { entity_id: entityId });
  }

  _setBrightness(entityId, e) {
    e.stopPropagation();
    this._hass.callService('light', 'turn_on', {
      entity_id: entityId,
      brightness_pct: parseInt(e.target.value, 10),
    });
  }

  _toggleFan(entityId, e) {
    e.stopPropagation();
    this._hass.callService('switch', 'toggle', { entity_id: entityId });
  }

  _toggleExpand(roomIdx, e) {
    e.stopPropagation();
    this._expanded = { ...this._expanded, [roomIdx]: !this._expanded[roomIdx] };
  }

  _toggleMasterAll(e) {
    e.stopPropagation();
    const { on, total } = this._globalLightsOn();
    const allEntities = this._config.rooms.flatMap(r => r.lights.map(l => l.entity));
    this._hass.callService('light', on > 0 ? 'turn_off' : 'turn_on', { entity_id: allEntities });
  }

  _renderLightControl(lightCfg) {
    const stateObj = this._hass?.states[lightCfg.entity];
    const isOn = stateObj?.state === 'on';
    const name = lightCfg.name || stateObj?.attributes?.friendly_name || lightCfg.entity;
    const brightness = stateObj?.attributes?.brightness;
    const brightnessPct = brightness ? Math.round((brightness / 255) * 100) : 0;

    return html`
      <div class="light-control-row">
        <div class="light-ctrl-header">
          <div class="light-ctrl-left">
            <div class="ctrl-dot ${isOn ? 'on' : ''}"></div>
            <span class="ctrl-name">${name}</span>
          </div>
          <div class="ctrl-right">
            ${isOn ? html`<span class="ctrl-brightness">${brightnessPct}%</span>` : ''}
            <button
              class="toggle-sm ${isOn ? 'on' : ''}"
              @click="${(e) => this._toggleLight(lightCfg.entity, e)}"
            ></button>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          .value="${isOn ? brightnessPct : 0}"
          ?disabled="${!isOn}"
          @change="${(e) => this._setBrightness(lightCfg.entity, e)}"
          style="background: linear-gradient(to right, #ffb938 ${isOn ? brightnessPct : 0}%, rgba(255,255,255,0.12) ${isOn ? brightnessPct : 0}%)"
        />
      </div>
    `;
  }

  _renderRoom(room, idx) {
    const { on, total } = this._getLightsState(room);
    const isActive = on > 0;
    const isExpanded = !!this._expanded[idx];

    const fanEntityId = room.fan;
    const fanState = fanEntityId ? this._hass?.states[fanEntityId] : null;
    const fanOn = fanState?.state === 'on';
    const fanName = room.fan_name || fanState?.attributes?.friendly_name || 'Fan';

    // Build pips (max 5 shown)
    const pipCount = Math.min(total, 5);
    const pips = Array.from({ length: total }, (_, i) => {
      const lightState = this._hass?.states[room.lights[i]?.entity];
      return lightState?.state === 'on';
    });

    return html`
      <div class="room-section ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}">
        <div class="room-header" @click="${(e) => this._toggleExpand(idx, e)}">
          <div class="room-left">
            <div class="room-icon-wrap">
              <ha-icon .icon="${room.icon || 'mdi:home'}"></ha-icon>
            </div>
            <div class="room-meta">
              <span class="room-name">${room.name || 'Room'}</span>
              <span class="room-count">
                ${isActive ? `${on}/${total} on` : `${total} light${total !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
          <div class="room-right">
            <div class="light-pips">
              ${pips.map(isOn => html`<div class="pip ${isOn ? 'on' : ''}"></div>`)}
            </div>
            <button
              class="toggle-btn ${isActive ? 'on' : ''}"
              @click="${(e) => { e.stopPropagation(); this._toggleRoom(idx); }}"
            ></button>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>

        <div class="expand-panel">
          ${room.lights.map(l => this._renderLightControl(l))}
          ${fanEntityId ? html`
            <div class="fan-ctrl-row ${fanOn ? 'fan-on' : ''}">
              <div class="fan-ctrl-left">
                <ha-icon .icon="${fanOn ? 'mdi:fan' : 'mdi:fan-off'}"></ha-icon>
                <span class="fan-ctrl-name">${fanName}</span>
              </div>
              <button
                class="toggle-sm ${fanOn ? 'on' : ''}"
                @click="${(e) => this._toggleFan(fanEntityId, e)}"
              ></button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  render() {
    if (!this._hass || !this._config) return html``;
    const { on: globalOn, total: globalTotal } = this._globalLightsOn();
    const glowClass = this._glowClass(globalOn, globalTotal);
    const title = this._config.title || 'Home Overview';
    const anyOn = globalOn > 0;

    return html`
      <ha-card>
        <div class="hero-card ${glowClass}">
          <div class="ambient-glow"></div>
          <div class="hero-inner">
            <div class="hero-title-bar">
              <div>
                <div class="hero-title">${title}</div>
                <div class="hero-summary">
                  ${anyOn
                    ? `${globalOn} light${globalOn !== 1 ? 's' : ''} on across ${this._config.rooms.length} rooms`
                    : 'All lights off'}
                </div>
              </div>
              <div class="hero-global-toggle">
                <span class="hero-global-label">All</span>
                <button
                  class="toggle-btn ${anyOn ? 'on' : ''}"
                  @click="${this._toggleMasterAll}"
                ></button>
              </div>
            </div>

            <div class="rooms-list">
              ${this._config.rooms.map((room, idx) => this._renderRoom(room, idx))}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define('matson-hero-card', MatsonHeroCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'matson-hero-card',
  name: 'Matson Hero Card',
  description: 'Showpiece overview card — all rooms with expandable light controls and ambient glow.',
});
