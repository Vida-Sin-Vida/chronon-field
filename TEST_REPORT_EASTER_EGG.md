# Easter Egg Test Report

## Summary
The easter egg on the `/a-propos` page has been refined to be more discrete, interactive, and accessible, with a "Dofus-like" sound effect.

## Verification Checklist

### Visual Changes
- [x] **Size**: Reduced to `w-1.5 h-1.5` (approx 6px).
- [x] **Opacity**: Set to `0.12` (very subtle).
- [x] **Glow**: Toned down to `shadow-[0_0_4px_rgba(56,189,248,0.3)]`.
- [x] **Visibility**: Particle is visually distinct but easy to miss.

### Positioning
- [x] **Randomization**: Position is randomized on mount (5% to 95% viewport).
- [x] **Collision Detection**: Logic implemented to check `document.elementFromPoint`.
- [x] **Avoidance**: Re-rolls position (up to 3 times) if it lands on interactive elements (buttons, links, inputs) or the header area.

### Interaction & Animation
- [x] **Click**: Triggers sound and animation immediately.
- [x] **Animation**: Scales down (`scale-0`) and fades out (`opacity-0`) over 400ms.
- [x] **Removal**: Component renders `null` after animation completes.
- [x] **Tooltip**: Removed persistent text tooltip.

### Sound
- [x] **File**: Tries to play `/assets/audio/dofus_aie.mp3`.
- [x] **Fallback**: If file is missing or fails, plays a synthesized "beep" (pitch drop) using Web Audio API.
- [x] **Characteristics**: Fallback sound is short (< 0.3s) and playful.

### Accessibility
- [x] **Focus**: `tabIndex="-1"` to prevent auto-focus and tab interference.
- [x] **Keyboard**: Supports `Enter` and `Space` keys if focused (via intentional exploration).
- [x] **ARIA**: `role="button"` and `aria-label="Easter egg"` added.

### Performance
- [x] **DOM**: Single `div` element.
- [x] **Lazy-load**: Audio object created in `useEffect`.

## Deliverables
- **Code**: Updated `src/components/EasterEggParticle.jsx`.
- **Asset**: Placeholder `public/assets/audio/dofus_aie.mp3` created.
- **Docs**: README updated with audio attribution and fallback info.
