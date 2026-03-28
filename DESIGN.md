# Design System Specification: Krisis Visual Identity

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Kinetic Monolith."** 

Krisis is a developer tool for machine learning infrastructure; it must feel solid, authoritative, and immovable, yet possess an underlying energy and intelligence. We move beyond the "generic SaaS" look by rejecting standard structural grids and borders. Instead, we define space through **Tonal Sculpting**. 

By using deep-space blacks and monochromatic navy grays, the UI should feel like a single, continuous obsidian surface where elements are revealed through light (gradients) and depth (nesting) rather than being "contained" by boxes. This design system prioritizes a sophisticated, editorial layout that favors generous white space and asymmetrical tension to signal a premium, high-engineering product.

---

## 2. Colors & Surface Logic

Our palette is rooted in a "Deep-Sea" dark mode, utilizing the `surface` and `surface-container` tiers to create a sense of vast, organized space.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. 
Structure is achieved through background color shifts. For example, a Hero section using `surface` (`#0b1326`) might transition into a Feature section using `surface-container-low` (`#131b2e`). This creates a "soft break" that feels high-end and intentional.

### Surface Hierarchy & Nesting
Treat the UI as a series of layered plates. 
- **Base Layer:** `surface` (#0b1326)
- **Primary Content Area:** `surface-container` (#171f33)
- **Elevated Cards/Modals:** `surface-container-high` (#222a3d) or `highest` (#2d3449)
- **Recessed Areas (Inputs/Code Blocks):** `surface-container-lowest` (#060e20)

### The "Glass & Gradient" Rule
To add "soul" to the ML infrastructure aesthetic:
- **Glassmorphism:** Use `surface-bright` (#31394d) at 40% opacity with a `20px` backdrop-blur for floating navigation or hovering tooltips.
- **Signature Gradients:** Main CTAs and Hero accents must use a linear gradient: `primary` (#c0c1ff) to `primary-container` (#8083ff) at a 135° angle. This adds a "vibrant indigo" energy that flat hex codes cannot replicate.

---

## 3. Typography: The Editorial Voice

We utilize **Inter** as our primary typeface, but we treat it with editorial weight to convey authority.

| Role | Token | Size | Weight / Tracking | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | 700 / -0.04em | "The Hook": Aggressive, tight kerning. |
| **Headline** | `headline-lg` | 2.0rem | 600 / -0.02em | Section titles that command attention. |
| **Title** | `title-md` | 1.125rem | 500 / Normal | Component headers and card titles. |
| **Body** | `body-md` | 0.875rem | 400 / +0.01em | High readability for technical docs. |
| **Label** | `label-sm` | 0.6875rem | 600 / +0.05em | Uppercase for metadata/system status. |

**Hierarchy Note:** Always pair a `display-lg` headline with a `body-lg` subtext. The extreme contrast between the heavy headline and the light, airy body text creates the "Krisis" signature sophisticated look.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** To lift a card, do not add a shadow. Instead, place a `surface-container-low` card on top of a `surface-container-lowest` background. The subtle shift in hex code creates a natural, "physical" lift.
- **Ambient Shadows:** For floating elements (Modals/Popovers), use a shadow with a blur of `40px` and an opacity of `8%`. The color must be a tint of `on-surface` (#dae2fd) rather than black, making the shadow feel like it's glowing from within the dark background.
- **The "Ghost Border" Fallback:** If a container requires a perimeter (e.g., in high-density data views), use the `outline-variant` token (#464554) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`) with `on-primary-container` text. 
- **Secondary:** `surface-container-highest` background. No border.
- **Tertiary:** Transparent background, `primary` text. Use `0.5rem` (md) roundedness.
- **Hover State:** Add a subtle `1px` inner glow using `primary-fixed`.

### Cards & Lists
- **Prohibition:** Forbid divider lines. 
- **Execution:** Separate list items using a `1.5` (0.375rem) vertical gap. Use a subtle background change (`surface-container-low` vs `surface-container-high`) on hover to indicate interactivity.

### Input Fields
- **Background:** `surface-container-lowest`.
- **Active State:** A `1px` "Ghost Border" using `primary` at 40% opacity. 
- **Typography:** Labels use `label-md` in `on-surface-variant`.

### Signature Component: The "Monolith Code Block"
ML infrastructure requires code. Code blocks should use `surface-container-lowest` with a "Ghost Border" on the left edge only, using the `tertiary` (#4cd7f6) accent color to denote the "active" logic.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins (e.g., more padding on the left than the right in hero sections) to create a custom, high-end feel.
- **Do** use `tertiary` (#4cd7f6) sparingly as a "data-point" accent—it should represent machine intelligence or successful pings.
- **Do** allow content to breathe. If a section feels crowded, double the spacing token (e.g., move from `12` to `24`).

### Don't
- **Don't** use 100% white (#FFFFFF) for body text. Use `on-surface` (#dae2fd) to reduce eye strain and maintain the sophisticated dark-mode atmosphere.
- **Don't** use standard `0.25rem` (default) rounding for everything. Use `full` (9999px) for chips and `0.75rem` (xl) for large feature cards to create a modern, varied rhythm.
- **Don't** ever use a pure black drop shadow. It kills the depth of the `#0b1326` background.