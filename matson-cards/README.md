# Matson Cards

A custom Lovelace card library for Home Assistant — clean, professional, and built for Conner's smart home dashboard.

Five cards in two themes: **monochrome** (default, near-black minimal) and **liquid-glass** (iOS 26-inspired frosted glass).

---

## Cards

| Card | Description |
|---|---|
| `matson-hero-card` | Full-width showpiece — all rooms at a glance, expandable controls, ambient glow |
| `matson-room-card` | Single room with master toggle + individual light/fan controls |
| `matson-light-card` | Single light with brightness + color temp sliders |
| `matson-header-card` | Dashboard header — time, date, person presence chips |
| `matson-status-chip` | Entity state badge with configurable colors |

---

## Installation

### Via HACS (recommended)

1. In HACS → **Frontend** → three-dot menu → **Custom repositories**
2. Add `https://github.com/cnr-mtsn/home-assistant` as a **Frontend** repository
3. Install **Matson Cards**
4. Clear browser cache and reload

### Manual

1. Copy `dist/matson-cards.js` to your HA config: `www/matson-cards/matson-cards.js`
2. In HA → Settings → Dashboards → Resources → Add:
   - URL: `/local/matson-cards/matson-cards.js`
   - Type: **JavaScript module**

### Lovelace Resource (HACS path)

```yaml
url: /hacsfiles/matson-cards/matson-cards.js
type: module
```

---

## Themes

Cards default to **monochrome**. To switch to liquid-glass, add `style: liquid-glass` to any card config:

```yaml
type: custom:matson-hero-card
style: liquid-glass
rooms: ...
```

To apply globally, set the CSS variable in your HA theme:
```yaml
# configuration.yaml → themes section
My Theme:
  matson-card-style: liquid-glass
```

---

## Card Configs

### `matson-hero-card`

The showpiece card. All rooms in one, expandable sections, ambient glow.

```yaml
type: custom:matson-hero-card
title: Home Overview       # optional, default "Home Overview"
style: monochrome          # or liquid-glass
rooms:
  - name: Master Bedroom
    icon: mdi:bed
    lights:
      - entity: light.dresser
        name: Dresser
      - entity: light.conners_nightstand
        name: "Conner's Side"
      - entity: light.sink_light
        name: "Rayne's Side"
    fan: switch.fan_socket_1
    fan_name: Bedroom Fan
  - name: Office
    icon: mdi:desk
    lights:
      - entity: light.left_floor_lamp
        name: Left Lamp
      - entity: light.right_floor_lamp
        name: Right Lamp
```

### `matson-room-card`

Single room card with master toggle and per-light sliders.

```yaml
type: custom:matson-room-card
name: Master Bedroom
icon: mdi:bed
style: monochrome
lights:
  - entity: light.dresser
    name: Dresser
  - entity: light.conners_nightstand
    name: "Conner's Side"
  - entity: light.sink_light
    name: "Rayne's Side"
fan: switch.fan_socket_1
fan_name: Bedroom Fan
```

### `matson-light-card`

Single light with always-visible sliders.

```yaml
type: custom:matson-light-card
entity: light.dresser
name: Dresser              # optional
style: monochrome
```

### `matson-header-card`

Full-width header with time, date, and presence chips.

```yaml
type: custom:matson-header-card
style: monochrome
persons:
  - entity: person.conner_matson
    name: Conner
    icon: mdi:account
  - entity: person.rayne_matson
    name: Rayne
    icon: mdi:account-heart
```

### `matson-status-chip`

Inline entity state badge. Works great in horizontal-stack or as part of a custom layout.

```yaml
type: custom:matson-status-chip
entity: person.conner_matson
name: Conner
icon: mdi:account
state_colors:
  home: "#50c878"
  away: "#f44336"
  unknown: "#888888"
```

---

## Full Dashboard Example

```yaml
views:
  - title: Home
    type: sections
    cards:
      - type: custom:matson-header-card
        persons:
          - entity: person.conner_matson
            name: Conner
            icon: mdi:account
          - entity: person.rayne_matson
            name: Rayne
            icon: mdi:account-heart

      - type: custom:matson-hero-card
        title: Home Overview
        rooms:
          - name: Master Bedroom
            icon: mdi:bed
            lights:
              - entity: light.dresser
                name: Dresser
              - entity: light.conners_nightstand
                name: "Conner's Side"
              - entity: light.sink_light
                name: "Rayne's Side"
            fan: switch.fan_socket_1
            fan_name: Bedroom Fan
          - name: Office
            icon: mdi:desk
            lights:
              - entity: light.left_floor_lamp
                name: Left Lamp
              - entity: light.right_floor_lamp
                name: Right Lamp
```

---

## Liquid Glass Theme

Inspired by iOS 26's frosted glass UI. Cards get a `backdrop-filter: blur(20px) saturate(180%)` treatment with semi-transparent backgrounds and amber-tinted active states.

Enable per-card with `style: liquid-glass`.

---

## Browser Compatibility

Tested on:
- Chrome/Chromium (desktop + Android)
- Safari (iOS + macOS) — full backdrop-filter support
- Firefox — backdrop-filter requires `layout.css.backdrop-filter.enabled: true` in about:config

---

## License

MIT — build whatever you want.
