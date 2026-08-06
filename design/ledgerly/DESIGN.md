---
name: Ledgerly
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#924628'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e3d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  tabular-nums:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is built on the principle of "Calm Finance." It prioritizes clarity over complexity, transforming the often stressful task of expense and delivery tracking into a serene, methodical experience. The target audience is professionals who value precision and efficiency but seek an interface that feels grounded and unobtrusive.

The design style is **Modern Corporate** with a focus on high-trust aesthetics. It utilizes generous whitespace, refined typography, and a "soft-minimalist" approach to UI elements. By avoiding aggressive gradients and heavy ornamentation, the system fosters a sense of stability and professional reliability.

## Colors
The palette is rooted in OKLCH-derived tones to ensure perceptual uniformity and accessibility. 

- **Primary (Teal):** Used for growth-oriented actions, progress indicators, and primary call-to-actions. It represents balance and financial health.
- **Neutral (Slate):** The backbone of the interface. Lighter tints are used for surfaces and backgrounds to reduce eye strain, while darker shades provide professional contrast for text and iconography.
- **Semantic Palette:** Functional colors are tuned to be legible but not alarming. Success emerald reflects completed deliveries and settled expenses; destructive rose is reserved for critical deletions and over-budget alerts.

## Typography
This design system utilizes **Inter** for its systematic neutrality and exceptional legibility. 

A critical feature of the typography is the use of **Tabular Figures** (`tnum`) for all financial data and delivery tracking IDs. This ensures that columns of numbers align vertically, making it easier for users to scan and compare costs or timestamps at a glance. Headlines use slightly tighter letter spacing for a more sophisticated, "inked" appearance, while body text remains open and breathable.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a maximum width of 1280px to maintain line-length readability on ultra-wide monitors, while fluidly scaling down to mobile widths.

- **Grid:** A 12-column grid is used for desktop views to organize complex financial dashboards and multi-step delivery forms. 
- **Rhythm:** An 8pt linear scale (4px, 8px, 16px, 24px, 32px, 48px, 64px) governs all padding and margins. 
- **Mobile Adaptivity:** On mobile, margins reduce to 16px, and multi-column tables reflow into stacked cards or horizontally scrollable containers to preserve data integrity.

## Elevation & Depth
To maintain a high-trust, professional feel, depth is communicated through **Low-Contrast Outlines** and **Ambient Shadows**.

1.  **Level 0 (Base):** The main background using the lightest slate tint (#F8FAFC).
2.  **Level 1 (Cards/Sections):** White surfaces with a 1px border in a soft slate (#E2E8F0). This provides structure without visual noise.
3.  **Level 2 (Dropdowns/Dialogs):** Elements that require focus utilize a subtle, extra-diffused shadow (Blur: 12px, Y: 4px, Opacity: 5% Slate).
4.  **Interactive States:** Hovering over actionable cards results in a slight elevation shift—deepening the shadow marginally rather than changing the border color aggressively.

## Shapes
The shape language is **Soft**. It avoids the playfulness of fully rounded "pill" shapes in favor of precise, small-radius corners. This maintains a "professional tool" aesthetic while feeling modern and approachable. All input fields, buttons, and cards share the same base corner radius (4px) to ensure visual continuity across the interface.

## Components
Components are designed with a functional, "shadcn/ui" inspired precision.

- **Buttons:** Primary buttons use a solid Teal fill with white text. Secondary buttons use a Slate-100 background or a ghost-style outline. All buttons have a fixed 40px height for standard actions.
- **Data Tables:** These are the heart of the application. Rows have a subtle hover state (#F1F5F9). Column headers use `label-caps` for clear categorization. Cells containing currency use `tabular-nums` aligned to the right.
- **Cards:** Used to group expense summaries and delivery status. They feature a 1px border and no shadow by default, gaining a shadow only when used as an interactive entry.
- **Inputs:** Clean, high-contrast text on a white background with a Slate-200 border. Focus states use a 2px Teal ring with an offset to ensure visibility.
- **Badges:** Used for delivery status (e.g., "In Transit", "Delivered"). These use a low-saturation background of the semantic colors with high-saturation text to ensure legibility without being distracting.
- **Timeline/Stepper:** A specialized component for tracking deliveries, using thin Slate lines and small Teal nodes to indicate progress chronologically.