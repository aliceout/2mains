// Vignettes wireframe pour la modale "Add Section" de l'admin Payload.
// Chaque vignette est un SVG encodé en data URL (aucun fichier statique
// → pas de soucis de routing /cms vs /).
//
// Style : fond beige paper (#F9E8D8), texte mockup gris (ink @50%),
// accents violet (#695EA3) pour les éléments hiérarchiques (titre,
// bouton, accent visuel). Aspect 3:2 (300×200), recommandé Payload.

const encode = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

const wrap = (innerSvg: string): string =>
  encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" fill="none">
  <rect width="300" height="200" fill="#F9E8D8"/>
  ${innerSvg}
</svg>`);

export const thumbProse = wrap(`
  <rect x="40" y="50" width="120" height="14" rx="2" fill="#695EA3"/>
  <rect x="40" y="84" width="220" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="40" y="98" width="200" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="40" y="112" width="220" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="40" y="126" width="160" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="40" y="140" width="220" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="40" y="154" width="180" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
`);

export const thumbCallout = wrap(`
  <rect x="40" y="60" width="220" height="80" rx="6" fill="#FFFFFF" stroke="#695EA3" stroke-width="2"/>
  <circle cx="65" cy="100" r="10" fill="#695EA3"/>
  <rect x="62" y="95" width="6" height="6" rx="1" fill="#FFFFFF"/>
  <rect x="62" y="103" width="6" height="2" rx="1" fill="#FFFFFF"/>
  <rect x="90" y="84" width="140" height="8" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="90" y="100" width="160" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="90" y="111" width="120" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
`);

export const thumbCitation = wrap(`
  <text x="50" y="90" font-family="Georgia, serif" font-size="80" fill="#695EA3" opacity="0.8">"</text>
  <rect x="100" y="68" width="160" height="7" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="100" y="84" width="140" height="7" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="100" y="100" width="100" height="7" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="100" y="130" width="60" height="5" rx="2" fill="#695EA3" opacity="0.6"/>
`);

export const thumbCta = wrap(`
  <rect x="60" y="50" width="180" height="10" rx="2" fill="#1A1A1A" opacity="0.8"/>
  <rect x="80" y="76" width="140" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="90" y="88" width="120" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="105" y="125" width="90" height="32" rx="16" fill="#695EA3"/>
  <rect x="125" y="138" width="50" height="6" rx="2" fill="#FFFFFF"/>
`);

// ─── Texte mis en valeur ─────────────────────────────────────────

export const thumbLettre = wrap(`
  <rect x="40" y="40" width="220" height="130" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.15"/>
  <rect x="55" y="55" width="60" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <rect x="55" y="78" width="180" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="55" y="91" width="170" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="55" y="104" width="180" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="55" y="117" width="140" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <text x="178" y="155" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#695EA3" opacity="0.8">— signé</text>
`);

export const thumbCitationLarge = wrap(`
  <text x="38" y="70" font-family="Georgia, serif" font-size="60" fill="#695EA3" opacity="0.8">"</text>
  <rect x="50" y="92" width="200" height="9" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="50" y="110" width="180" height="9" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="50" y="128" width="160" height="9" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="50" y="160" width="80" height="6" rx="2" fill="#695EA3" opacity="0.6"/>
`);

export const thumbStatMajeste = wrap(`
  <text x="150" y="115" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="72" fill="#695EA3">87%</text>
  <rect x="80" y="138" width="140" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="100" y="152" width="100" height="6" rx="2" fill="#1A1A1A" opacity="0.5"/>
`);

export const thumbChiffreDetail = wrap(`
  <text x="80" y="125" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="56" fill="#EC6A2C">42</text>
  <rect x="140" y="80" width="110" height="7" rx="2" fill="#1A1A1A" opacity="0.7"/>
  <rect x="140" y="98" width="120" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="140" y="110" width="100" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="140" y="122" width="115" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
`);

// ─── Grilles ─────────────────────────────────────────────────────

const card = (x: number, y: number, w: number, h: number, accent: string): string => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <rect x="${x + 8}" y="${y + 10}" width="20" height="20" rx="4" fill="${accent}" opacity="0.8"/>
  <rect x="${x + 8}" y="${y + 38}" width="${w - 22}" height="5" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <rect x="${x + 8}" y="${y + 50}" width="${w - 30}" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="${x + 8}" y="${y + 58}" width="${w - 35}" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
`;

export const thumbBlocCartes = wrap(`
  ${card(35, 55, 70, 90, '#695EA3')}
  ${card(115, 55, 70, 90, '#EC6A2C')}
  ${card(195, 55, 70, 90, '#A2D1B0')}
`);

export const thumbBlocValeurs = wrap(`
  <rect x="40" y="35" width="100" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  ${card(35, 60, 70, 90, '#695EA3')}
  ${card(115, 60, 70, 90, '#DD057E')}
  ${card(195, 60, 70, 90, '#00607E')}
`);

export const thumbFormats = wrap(`
  <rect x="35" y="40" width="115" height="120" rx="6" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <rect x="48" y="55" width="60" height="7" rx="2" fill="#695EA3"/>
  <rect x="48" y="75" width="85" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="48" y="86" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="48" y="100" width="3" height="4" rx="1" fill="#695EA3"/>
  <rect x="56" y="100" width="60" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="48" y="110" width="3" height="4" rx="1" fill="#695EA3"/>
  <rect x="56" y="110" width="50" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="48" y="135" width="55" height="14" rx="7" fill="#695EA3"/>
  <rect x="150" y="40" width="115" height="120" rx="6" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <rect x="163" y="55" width="60" height="7" rx="2" fill="#EC6A2C"/>
  <rect x="163" y="75" width="85" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="163" y="86" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="163" y="100" width="3" height="4" rx="1" fill="#EC6A2C"/>
  <rect x="171" y="100" width="60" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="163" y="110" width="3" height="4" rx="1" fill="#EC6A2C"/>
  <rect x="171" y="110" width="50" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="163" y="135" width="55" height="14" rx="7" fill="#EC6A2C"/>
`);

export const thumbEtapes = wrap(`
  <line x1="55" y1="80" x2="245" y2="80" stroke="#695EA3" stroke-width="2" stroke-dasharray="4,4" opacity="0.5"/>
  <circle cx="60" cy="80" r="14" fill="#695EA3"/>
  <text x="60" y="84" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">1</text>
  <rect x="42" y="105" width="36" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="46" y="116" width="28" height="4" rx="1.5" fill="#1A1A1A" opacity="0.3"/>
  <circle cx="123" cy="80" r="14" fill="#695EA3" opacity="0.7"/>
  <text x="123" y="84" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">2</text>
  <rect x="105" y="105" width="36" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="109" y="116" width="28" height="4" rx="1.5" fill="#1A1A1A" opacity="0.3"/>
  <circle cx="186" cy="80" r="14" fill="#695EA3" opacity="0.5"/>
  <text x="186" y="84" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">3</text>
  <rect x="168" y="105" width="36" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="172" y="116" width="28" height="4" rx="1.5" fill="#1A1A1A" opacity="0.3"/>
  <circle cx="249" cy="80" r="14" fill="#695EA3" opacity="0.3"/>
  <text x="249" y="84" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">4</text>
  <rect x="231" y="105" width="36" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="235" y="116" width="28" height="4" rx="1.5" fill="#1A1A1A" opacity="0.3"/>
`);

export const thumbFaq = wrap(`
  <rect x="40" y="50" width="220" height="28" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <rect x="55" y="61" width="140" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <path d="M 240 60 L 245 67 L 250 60" stroke="#695EA3" stroke-width="2" fill="none"/>
  <rect x="40" y="86" width="220" height="50" rx="4" fill="#FFFFFF" stroke="#695EA3" stroke-width="1"/>
  <rect x="55" y="97" width="120" height="6" rx="2" fill="#695EA3"/>
  <rect x="55" y="113" width="180" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="55" y="123" width="160" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <path d="M 240 100 L 245 95 L 250 100" stroke="#695EA3" stroke-width="2" fill="none"/>
  <rect x="40" y="144" width="220" height="28" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <rect x="55" y="155" width="160" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <path d="M 240 154 L 245 161 L 250 154" stroke="#695EA3" stroke-width="2" fill="none"/>
`);

export const thumbBlocStat = wrap(`
  <rect x="35" y="65" width="55" height="70" rx="4" fill="#FFFFFF"/>
  <text x="62" y="100" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="22" fill="#695EA3">12K</text>
  <rect x="42" y="110" width="40" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  <rect x="48" y="118" width="28" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
  <rect x="98" y="65" width="55" height="70" rx="4" fill="#FFFFFF"/>
  <text x="125" y="100" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="22" fill="#EC6A2C">87%</text>
  <rect x="105" y="110" width="40" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  <rect x="111" y="118" width="28" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
  <rect x="161" y="65" width="55" height="70" rx="4" fill="#FFFFFF"/>
  <text x="188" y="100" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="22" fill="#A2D1B0">3</text>
  <rect x="168" y="110" width="40" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  <rect x="174" y="118" width="28" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
  <rect x="224" y="65" width="55" height="70" rx="4" fill="#FFFFFF"/>
  <text x="251" y="100" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="22" fill="#DD057E">42</text>
  <rect x="231" y="110" width="40" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  <rect x="237" y="118" width="28" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
`);

// ─── Image + texte ───────────────────────────────────────────────

export const thumbDeuxColonnes = wrap(`
  <rect x="35" y="40" width="115" height="120" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <circle cx="55" cy="60" r="8" fill="#A2D1B0"/>
  <rect x="48" y="80" width="90" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <rect x="48" y="96" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="48" y="106" width="85" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="48" y="116" width="75" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="48" y="126" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="160" y="40" width="105" height="120" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <circle cx="180" cy="60" r="8" fill="#695EA3"/>
  <rect x="173" y="80" width="80" height="6" rx="2" fill="#1A1A1A" opacity="0.6"/>
  <rect x="173" y="96" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="173" y="106" width="75" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="173" y="116" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="173" y="126" width="70" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
`);

const photoPlaceholder = (x: number, y: number, w: number, h: number): string => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#1A1A1A" opacity="0.15"/>
  <circle cx="${x + w * 0.7}" cy="${y + h * 0.3}" r="${Math.min(w, h) * 0.1}" fill="#1A1A1A" opacity="0.3"/>
  <path d="M ${x + 8} ${y + h - 8} L ${x + w * 0.4} ${y + h * 0.5} L ${x + w * 0.7} ${y + h * 0.75} L ${x + w - 8} ${y + h - 8} Z" fill="#1A1A1A" opacity="0.3"/>
`;

export const thumbTextePhoto = wrap(`
  ${photoPlaceholder(35, 40, 110, 120)}
  <rect x="160" y="55" width="90" height="8" rx="2" fill="#695EA3"/>
  <rect x="160" y="80" width="105" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="160" y="92" width="100" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="160" y="104" width="105" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="160" y="116" width="80" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="160" y="128" width="100" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
  <rect x="160" y="140" width="70" height="5" rx="2" fill="#1A1A1A" opacity="0.4"/>
`);

export const thumbFigure = wrap(`
  ${photoPlaceholder(70, 40, 160, 110)}
  <rect x="100" y="160" width="100" height="5" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="120" y="172" width="60" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
`);

export const thumbGalerie = wrap(`
  ${photoPlaceholder(35, 40, 70, 50)}
  ${photoPlaceholder(115, 40, 70, 50)}
  ${photoPlaceholder(195, 40, 70, 50)}
  ${photoPlaceholder(35, 100, 70, 50)}
  ${photoPlaceholder(115, 100, 70, 50)}
  ${photoPlaceholder(195, 100, 70, 50)}
`);

export const thumbBandeauImage = wrap(`
  <rect x="0" y="20" width="300" height="160" fill="#1A1A1A" opacity="0.2"/>
  <circle cx="220" cy="60" r="14" fill="#1A1A1A" opacity="0.3"/>
  <path d="M 0 180 L 100 110 L 180 140 L 250 100 L 300 130 L 300 180 Z" fill="#1A1A1A" opacity="0.3"/>
  <rect x="60" y="90" width="180" height="10" rx="2" fill="#FFFFFF"/>
  <rect x="80" y="110" width="140" height="6" rx="2" fill="#FFFFFF" opacity="0.8"/>
`);

// ─── Personnes ───────────────────────────────────────────────────

const portrait = (cx: number, cy: number, r: number, accent: string): string => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${accent}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy - r * 0.15}" r="${r * 0.35}" fill="${accent}" opacity="0.6"/>
  <path d="M ${cx - r * 0.6} ${cy + r * 0.6} Q ${cx} ${cy + r * 0.1} ${cx + r * 0.6} ${cy + r * 0.6} Z" fill="${accent}" opacity="0.6"/>
`;

export const thumbPortraits = wrap(`
  ${portrait(60, 80, 25, '#695EA3')}
  ${portrait(120, 80, 25, '#EC6A2C')}
  ${portrait(180, 80, 25, '#A2D1B0')}
  ${portrait(240, 80, 25, '#DD057E')}
  <rect x="35" y="120" width="50" height="5" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="42" y="132" width="36" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="95" y="120" width="50" height="5" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="102" y="132" width="36" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="155" y="120" width="50" height="5" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="162" y="132" width="36" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
  <rect x="215" y="120" width="50" height="5" rx="2" fill="#1A1A1A" opacity="0.5"/>
  <rect x="222" y="132" width="36" height="4" rx="1.5" fill="#1A1A1A" opacity="0.35"/>
`);

export const thumbTimeline = wrap(`
  <line x1="60" y1="40" x2="60" y2="170" stroke="#695EA3" stroke-width="2" opacity="0.4"/>
  <circle cx="60" cy="55" r="7" fill="#695EA3"/>
  <rect x="80" y="48" width="50" height="5" rx="2" fill="#695EA3"/>
  <rect x="80" y="60" width="160" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <circle cx="60" cy="95" r="7" fill="#695EA3" opacity="0.7"/>
  <rect x="80" y="88" width="50" height="5" rx="2" fill="#695EA3" opacity="0.7"/>
  <rect x="80" y="100" width="180" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <circle cx="60" cy="135" r="7" fill="#695EA3" opacity="0.5"/>
  <rect x="80" y="128" width="50" height="5" rx="2" fill="#695EA3" opacity="0.5"/>
  <rect x="80" y="140" width="170" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
`);

export const thumbTemoignages = wrap(`
  <rect x="35" y="50" width="100" height="100" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <text x="48" y="80" font-family="Georgia, serif" font-size="36" fill="#695EA3" opacity="0.7">"</text>
  <rect x="48" y="92" width="75" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="48" y="102" width="65" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="48" y="112" width="70" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  ${portrait(60, 138, 8, '#695EA3')}
  <rect x="78" y="135" width="40" height="3.5" rx="1" fill="#1A1A1A" opacity="0.5"/>
  <rect x="78" y="142" width="32" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
  <rect x="155" y="50" width="110" height="100" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-opacity="0.1"/>
  <text x="168" y="80" font-family="Georgia, serif" font-size="36" fill="#EC6A2C" opacity="0.7">"</text>
  <rect x="168" y="92" width="80" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="168" y="102" width="75" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  <rect x="168" y="112" width="70" height="4" rx="1.5" fill="#1A1A1A" opacity="0.4"/>
  ${portrait(180, 138, 8, '#EC6A2C')}
  <rect x="198" y="135" width="40" height="3.5" rx="1" fill="#1A1A1A" opacity="0.5"/>
  <rect x="198" y="142" width="32" height="3" rx="1" fill="#1A1A1A" opacity="0.35"/>
`);

export const thumbEquipe = wrap(`
  ${portrait(55, 70, 18, '#695EA3')}
  <rect x="38" y="98" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(115, 70, 18, '#EC6A2C')}
  <rect x="98" y="98" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(175, 70, 18, '#A2D1B0')}
  <rect x="158" y="98" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(235, 70, 18, '#DD057E')}
  <rect x="218" y="98" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(85, 140, 18, '#00607E')}
  <rect x="68" y="168" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(150, 140, 18, '#695EA3')}
  <rect x="133" y="168" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
  ${portrait(215, 140, 18, '#EC6A2C')}
  <rect x="198" y="168" width="34" height="4" rx="1.5" fill="#1A1A1A" opacity="0.5"/>
`);
