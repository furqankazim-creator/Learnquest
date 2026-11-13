// Vector logo: a friendly owl wearing a graduation cap. Drawn on a 1024 x 1024 canvas.
export const MARK = `
  <ellipse cx="512" cy="905" rx="215" ry="22" fill="#000" opacity="0.16"/>
  <ellipse cx="445" cy="858" rx="62" ry="26" fill="#FF8A3D"/>
  <ellipse cx="579" cy="858" rx="62" ry="26" fill="#FF8A3D"/>
  <path d="M290 372 L262 236 L408 322 Z" fill="#7A4B2A"/>
  <path d="M734 372 L762 236 L616 322 Z" fill="#7A4B2A"/>
  <ellipse cx="270" cy="640" rx="62" ry="150" fill="#6A3F22" transform="rotate(14 270 640)"/>
  <ellipse cx="754" cy="640" rx="62" ry="150" fill="#6A3F22" transform="rotate(-14 754 640)"/>
  <ellipse cx="512" cy="580" rx="258" ry="285" fill="#8D5A34"/>
  <ellipse cx="512" cy="650" rx="168" ry="195" fill="#FFE3B8"/>
  <g fill="#E8C48E">
    <path d="M440 700 q20 22 40 0 q-20 -4 -40 0Z"/><path d="M544 700 q20 22 40 0 q-20 -4 -40 0Z"/>
    <path d="M492 755 q20 22 40 0 q-20 -4 -40 0Z"/><path d="M440 810 q20 22 40 0 q-20 -4 -40 0Z"/>
    <path d="M544 810 q20 22 40 0 q-20 -4 -40 0Z"/>
  </g>
  <circle cx="408" cy="556" r="96" fill="#fff" stroke="#FFC93C" stroke-width="26"/>
  <circle cx="616" cy="556" r="96" fill="#fff" stroke="#FFC93C" stroke-width="26"/>
  <circle cx="418" cy="562" r="46" fill="#2D2A4A"/>
  <circle cx="606" cy="562" r="46" fill="#2D2A4A"/>
  <circle cx="434" cy="544" r="16" fill="#fff"/>
  <circle cx="622" cy="544" r="16" fill="#fff"/>
  <path d="M512 596 L478 652 L512 694 L546 652 Z" fill="#FF8A3D"/>
  <path d="M512 596 L546 652 L512 694 Z" fill="#E8701F"/>
  <path d="M352 392 v54 q160 84 320 0 v-54 Z" fill="#3B3768"/>
  <path d="M512 232 L790 342 L512 452 L234 342 Z" fill="#2D2A4A"/>
  <path d="M512 232 L790 342 L512 452 Z" fill="#26234A"/>
  <path d="M512 262 L722 345 L512 428 L302 345 Z" fill="none" stroke="#6C5CE7" stroke-width="10" opacity="0.8"/>
  <circle cx="512" cy="342" r="22" fill="#FFC93C"/>
  <path d="M512 342 L756 360 L758 478" fill="none" stroke="#FFC93C" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M758 470 l-18 40 h36 Z" fill="#FFC93C"/>
  <circle cx="758" cy="470" r="14" fill="#FFC93C"/>
  <path d="M236 186 l14 38 l38 14 l-38 14 l-14 38 l-14 -38 l-38 -14 l38 -14 Z" fill="#FFC93C"/>
  <path d="M830 560 l10 28 l28 10 l-28 10 l-10 28 l-10 -28 l-28 -10 l28 -10 Z" fill="#fff" opacity="0.95"/>
  <path d="M190 520 l8 22 l22 8 l-22 8 l-8 22 l-8 -22 l-22 -8 l22 -8 Z" fill="#fff" opacity="0.95"/>
`;

const GRADIENT = `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7B6CF0"/><stop offset="0.55" stop-color="#6C5CE7"/><stop offset="1" stop-color="#4D96FF"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.35" r="0.6">
    <stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
</defs>`;

// scale = how much of the canvas the owl fills (1 = full size)
export function markGroup(scale = 1) {
  const t = (1 - scale) * 512;
  return `<g transform="translate(${t} ${t + 10 * scale}) scale(${scale})">${MARK}</g>`;
}

// Full app icon: gradient badge + owl
export function iconSvg(opts: { scale?: number; rounded?: boolean } = {}) {
  const { scale = 0.86, rounded = false } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${GRADIENT}
  <rect width="1024" height="1024" ${rounded ? 'rx="230"' : ''} fill="url(#bg)"/>
  <rect width="1024" height="1024" ${rounded ? 'rx="230"' : ''} fill="url(#glow)"/>
  ${markGroup(scale)}</svg>`;
}

export function backgroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${GRADIENT}
  <rect width="1024" height="1024" fill="url(#bg)"/><rect width="1024" height="1024" fill="url(#glow)"/></svg>`;
}

// Transparent owl only (Android foreground / splash), with safe-zone padding
export function markSvg(scale = 0.66) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${markGroup(scale)}</svg>`;
}

// Badge used inside the app (welcome screen)
export function badgeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${GRADIENT}
  <circle cx="512" cy="512" r="512" fill="url(#bg)"/><circle cx="512" cy="512" r="512" fill="url(#glow)"/>
  ${markGroup(0.98)}</svg>`;
}
