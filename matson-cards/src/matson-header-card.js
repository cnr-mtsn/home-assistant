/**
 * matson-header-card
 * Full-width dashboard header with time, date, and person presence chips.
 *
 * Config:
 *   persons:
 *     - entity: person.conner_matson
 *       name: Conner
 *       icon: mdi:account
 *     - entity: person.rayne_matson
 *       name: Rayne
 *       icon: mdi:account-heart
 *   style: "monochrome" | "liquid-glass"
 */
import { LitElement, html, css } from 'https://esm.sh/lit@3';

const baseStyles = css`
  :host {
    display: block;
    font-family: var(--mc-font, system-ui, sans-serif);
  }
  .header-card {
    background: var(--mc-bg-card, #181818);
    border: var(--mc-border, 1px solid rgba(255,255,255,0.08));
    border-radius: var(--mc-radius, 16px);
    padding: 18px 22px 16px;
    box-shadow: var(--mc-shadow, 0 2px 8px rgba(0,0,0,0.5));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
  }
  .top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .time-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .time {
    font-size: 38px;
    font-weight: 300;
    letter-spacing: -1px;
    color: var(--mc-text-primary, #f0f0f0);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .date {
    font-size: 14px;
    font-weight: 400;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    letter-spacing: 0.2px;
    margin-top: 4px;
  }
  .persons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    align-self: flex-start;
    padding-top: 4px;
  }
  .person-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px 6px 8px;
    border-radius: 999px;
    background: var(--mc-chip-bg, rgba(255,255,255,0.07));
    border: var(--mc-chip-border, 1px solid rgba(255,255,255,0.1));
    backdrop-filter: var(--mc-blur, none);
    -webkit-backdrop-filter: var(--mc-blur, none);
    transition: background var(--mc-transition, 300ms ease),
                border-color var(--mc-transition, 300ms ease);
  }
  .person-chip.home {
    background: rgba(80, 200, 120, 0.12);
    border-color: rgba(80, 200, 120, 0.28);
  }
  .person-chip ha-icon {
    --mdc-icon-size: 16px;
    color: var(--mc-icon-inactive, rgba(240,240,240,0.4));
    transition: color var(--mc-transition, 300ms ease);
  }
  .person-chip.home ha-icon {
    color: #50c878;
  }
  .person-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--mc-text-primary, #f0f0f0);
    white-space: nowrap;
  }
  .person-state {
    font-size: 11px;
    color: var(--mc-text-secondary, rgba(240,240,240,0.55));
    white-space: nowrap;
  }
  .separator {
    height: 1px;
    background: var(--mc-separator, rgba(255,255,255,0.08));
    margin-top: 16px;
    border-radius: 1px;
  }
`;

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

class MatsonHeaderCard extends LitElement {
  static get properties() {
    return {
      _hass: { state: true },
      _config: { state: true },
      _time: { state: true },
      _date: { state: true },
    };
  }

  static get styles() { return baseStyles; }

  constructor() {
    super();
    this._tick = this._tick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick();
    this._interval = setInterval(this._tick, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._interval);
  }

  _tick() {
    const now = new Date();
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    this._time = `${h}:${m} ${ampm}`;
    this._date = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  }

  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() { return 2; }

  _renderPerson(personCfg) {
    if (!this._hass) return html``;
    const stateObj = this._hass.states[personCfg.entity];
    const state = stateObj?.state || 'unknown';
    const isHome = state === 'home';
    const icon = personCfg.icon || (isHome ? 'mdi:account' : 'mdi:account-arrow-right');
    const name = personCfg.name || stateObj?.attributes?.friendly_name || personCfg.entity;

    return html`
      <div class="person-chip ${isHome ? 'home' : ''}">
        <ha-icon .icon="${icon}"></ha-icon>
        <span class="person-name">${name}</span>
        <span class="person-state">${state}</span>
      </div>
    `;
  }

  render() {
    if (!this._config) return html``;
    const persons = this._config.persons || [];

    return html`
      <ha-card>
        <div class="header-card">
          <div class="top-row">
            <div class="time-block">
              <div class="time">${this._time}</div>
              <div class="date">${this._date}</div>
            </div>
            <div class="persons">
              ${persons.map(p => this._renderPerson(p))}
            </div>
          </div>
          <div class="separator"></div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define('matson-header-card', MatsonHeaderCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'matson-header-card',
  name: 'Matson Header Card',
  description: 'Full-width dashboard header with time, date, and person presence.',
});
