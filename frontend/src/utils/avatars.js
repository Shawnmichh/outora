/* eslint-disable max-len */

/**
 * Self-contained avatar illustrations — no external CDN required.
 * Each avatar is a 100×100 SVG encoded as a data URI.
 * Characters are distinct flat-illustrated figures with faces,
 * hair, accessories, and personality.
 */

const uri = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}`;

/* ── 1. Wanderer ── adventure hat, warm skin, orange jacket ── */
const a1 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#FDDCB5"/>
<rect x="24" y="78" width="52" height="22" rx="12" fill="#E8943A"/>
<circle cx="50" cy="57" r="23" fill="#D4906A"/>
<rect x="29" y="12" width="42" height="20" rx="7" fill="#7C4A18"/>
<rect x="18" y="28" width="64" height="9" rx="4.5" fill="#9B5E22"/>
<rect x="29" y="29" width="42" height="6" fill="#E8943A"/>
<circle cx="42" cy="53" r="4" fill="#fff"/>
<circle cx="58" cy="53" r="4" fill="#fff"/>
<circle cx="43" cy="54" r="2.5" fill="#1A0800"/>
<circle cx="59" cy="54" r="2.5" fill="#1A0800"/>
<circle cx="44" cy="53" r="1" fill="#fff"/>
<circle cx="60" cy="53" r="1" fill="#fff"/>
<path d="M42 64 Q50 72 58 64" fill="none" stroke="#A05030" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="34" cy="61" r="5" fill="#E07050" opacity="0.45"/>
<circle cx="66" cy="61" r="5" fill="#E07050" opacity="0.45"/>
<ellipse cx="50" cy="70" rx="3" ry="2" fill="#B07040"/>
</svg>`);

/* ── 2. Stargazer ── space buns, dark skin, purple vibe, stars ── */
const a2 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#EDE9FE"/>
<rect x="22" y="78" width="56" height="22" rx="12" fill="#7C3AED"/>
<circle cx="50" cy="57" r="23" fill="#4A230A"/>
<ellipse cx="50" cy="38" rx="22" ry="13" fill="#1A0802"/>
<circle cx="33" cy="33" rx="9" ry="9" r="9" fill="#1A0802"/>
<circle cx="67" cy="33" r="9" fill="#1A0802"/>
<circle cx="33" cy="33" r="5" fill="#2D1408"/>
<circle cx="67" cy="33" r="5" fill="#2D1408"/>
<circle cx="42" cy="54" r="4.5" fill="#fff"/>
<circle cx="58" cy="54" r="4.5" fill="#fff"/>
<circle cx="43" cy="55" r="3" fill="#7C3AED"/>
<circle cx="59" cy="55" r="3" fill="#7C3AED"/>
<circle cx="43" cy="55" r="1.2" fill="#0D0215"/>
<circle cx="59" cy="55" r="1.2" fill="#0D0215"/>
<circle cx="44.5" cy="53.5" r="1" fill="#fff"/>
<circle cx="60.5" cy="53.5" r="1" fill="#fff"/>
<path d="M42 64 Q50 71 58 64" fill="none" stroke="#2D1408" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="34" cy="61" r="5" fill="#A78BFA" opacity="0.4"/>
<circle cx="66" cy="61" r="5" fill="#A78BFA" opacity="0.4"/>
<polygon points="82,14 83.5,18.5 88,18.5 84.5,21 85.8,25.5 82,23 78.2,25.5 79.5,21 76,18.5 80.5,18.5" fill="#FCD34D"/>
<polygon points="14,22 15,25 18,25 15.5,27 16.5,30 14,28.5 11.5,30 12.5,27 10,25 13,25" fill="#FCD34D"/>
</svg>`);

/* ── 3. Sunny ── wavy yellow hair, light skin, big grin, pink top ── */
const a3 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#FEF9C3"/>
<rect x="20" y="78" width="60" height="22" rx="12" fill="#F472B6"/>
<circle cx="50" cy="57" r="23" fill="#FDCFAC"/>
<ellipse cx="50" cy="40" rx="26" ry="18" fill="#FCD34D"/>
<path d="M24 50 Q18 68 24 84" stroke="#FCD34D" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M76 50 Q82 68 76 84" stroke="#FCD34D" stroke-width="14" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="57" r="23" fill="#FDCFAC"/>
<ellipse cx="50" cy="40" rx="24" ry="10" fill="#FCD34D"/>
<ellipse cx="43" cy="34" rx="8" ry="6" fill="#FDCFAC"/>
<circle cx="42" cy="53" r="4.5" fill="#fff"/>
<circle cx="58" cy="53" r="4.5" fill="#fff"/>
<circle cx="43" cy="54" r="3" fill="#6D28D9"/>
<circle cx="59" cy="54" r="3" fill="#6D28D9"/>
<circle cx="43" cy="54" r="1.2" fill="#1C0842"/>
<circle cx="59" cy="54" r="1.2" fill="#1C0842"/>
<circle cx="44.5" cy="52.5" r="1" fill="#fff"/>
<circle cx="60.5" cy="52.5" r="1" fill="#fff"/>
<path d="M41 64 Q50 74 59 64" fill="none" stroke="#C2666A" stroke-width="3" stroke-linecap="round"/>
<path d="M43 66 Q50 72 57 66" fill="#fff"/>
<circle cx="34" cy="61" r="6" fill="#FB7185" opacity="0.5"/>
<circle cx="66" cy="61" r="6" fill="#FB7185" opacity="0.5"/>
</svg>`);

/* ── 4. Chill ── blue headphones, medium skin, blue hoodie ── */
const a4 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#DBEAFE"/>
<rect x="20" y="78" width="60" height="22" rx="12" fill="#3B82F6"/>
<circle cx="50" cy="57" r="23" fill="#C49060"/>
<ellipse cx="50" cy="38" rx="21" ry="14" fill="#1C1008"/>
<path d="M29 50 Q28 36 50 34 Q72 36 71 50" fill="none" stroke="#1C1008" stroke-width="6" stroke-linecap="round"/>
<rect x="23" y="46" width="10" height="14" rx="5" fill="#3B82F6"/>
<rect x="67" y="46" width="10" height="14" rx="5" fill="#3B82F6"/>
<ellipse cx="50" cy="34" rx="21" ry="10" fill="#1C1008"/>
<circle cx="42" cy="54" r="4" fill="#fff"/>
<circle cx="58" cy="54" r="4" fill="#fff"/>
<circle cx="43" cy="55" r="2.5" fill="#0A0502"/>
<circle cx="59" cy="55" r="2.5" fill="#0A0502"/>
<circle cx="44" cy="54" r="1" fill="#fff"/>
<circle cx="60" cy="54" r="1" fill="#fff"/>
<path d="M42 52 Q50 49 58 52" fill="#C49060"/>
<path d="M44 64 Q50 70 56 66" fill="none" stroke="#8B5A30" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="35" cy="61" r="5" fill="#D08060" opacity="0.3"/>
<circle cx="65" cy="61" r="5" fill="#D08060" opacity="0.3"/>
</svg>`);

/* ── 5. Explorer ── cool sunglasses, tan skin, mint jacket ── */
const a5 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#D1FAE5"/>
<rect x="20" y="78" width="60" height="22" rx="12" fill="#059669"/>
<circle cx="50" cy="57" r="23" fill="#A07840"/>
<ellipse cx="50" cy="39" rx="22" ry="14" fill="#2D1806"/>
<path d="M28 40 Q26 30 36 34" fill="#2D1806"/>
<path d="M72 40 Q74 30 64 34" fill="#2D1806"/>
<rect x="30" y="49" width="17" height="12" rx="6" fill="#0D4F38"/>
<rect x="53" y="49" width="17" height="12" rx="6" fill="#0D4F38"/>
<rect x="30" y="49" width="17" height="12" rx="6" fill="#065F46" opacity="0.6"/>
<rect x="53" y="49" width="17" height="12" rx="6" fill="#065F46" opacity="0.6"/>
<line x1="47" y1="55" x2="53" y2="55" stroke="#0D4F38" stroke-width="2"/>
<line x1="30" y1="55" x2="24" y2="53" stroke="#0D4F38" stroke-width="2"/>
<line x1="70" y1="55" x2="76" y2="53" stroke="#0D4F38" stroke-width="2"/>
<path d="M42 63 Q50 71 58 63" fill="none" stroke="#6B4020" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="34" cy="62" r="5" fill="#C88040" opacity="0.35"/>
<circle cx="66" cy="62" r="5" fill="#C88040" opacity="0.35"/>
</svg>`);

/* ── 6. Nite Owl ── gaming glasses, pale, dark hair w/ purple streak ── */
const a6 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#E0E7FF"/>
<rect x="20" y="78" width="60" height="22" rx="12" fill="#4338CA"/>
<circle cx="50" cy="57" r="23" fill="#EEC8D8"/>
<ellipse cx="50" cy="38" rx="22" ry="14" fill="#120820"/>
<path d="M28 42 Q26 28 36 32" fill="#120820"/>
<path d="M72 42 Q74 28 64 32" fill="#120820"/>
<path d="M62 24 Q66 16 72 24" fill="none" stroke="#A78BFA" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="50" cy="38" rx="20" ry="10" fill="#120820"/>
<rect x="31" y="49" width="15" height="11" rx="4" fill="none" stroke="#6366F1" stroke-width="2.5"/>
<rect x="54" y="49" width="15" height="11" rx="4" fill="none" stroke="#6366F1" stroke-width="2.5"/>
<line x1="46" y1="54.5" x2="54" y2="54.5" stroke="#6366F1" stroke-width="2"/>
<line x1="31" y1="54.5" x2="25" y2="52" stroke="#6366F1" stroke-width="2"/>
<line x1="69" y1="54.5" x2="75" y2="52" stroke="#6366F1" stroke-width="2"/>
<circle cx="38.5" cy="54.5" r="3" fill="#818CF8" opacity="0.5"/>
<circle cx="61.5" cy="54.5" r="3" fill="#818CF8" opacity="0.5"/>
<path d="M43 64 Q52 70 58 66" fill="none" stroke="#A07090" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

/* ── 7. Bookworm ── round glasses, afro, brown skin, mustard sweater ── */
const a7 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#FEF3C7"/>
<rect x="20" y="78" width="60" height="22" rx="12" fill="#D97706"/>
<circle cx="50" cy="57" r="23" fill="#8B5A2B"/>
<circle cx="50" cy="41" r="20" fill="#1C0802"/>
<circle cx="38" cy="35" r="9" fill="#241006"/>
<circle cx="62" cy="35" r="9" fill="#241006"/>
<circle cx="50" cy="30" r="10" fill="#241006"/>
<circle cx="38" cy="38" r="6" fill="#2D1408"/>
<circle cx="62" cy="38" r="6" fill="#2D1408"/>
<circle cx="41" cy="55" r="7" fill="none" stroke="#1C0802" stroke-width="2.5"/>
<circle cx="59" cy="55" r="7" fill="none" stroke="#1C0802" stroke-width="2.5"/>
<circle cx="41" cy="55" r="7" fill="#F59E0B" opacity="0.15"/>
<circle cx="59" cy="55" r="7" fill="#F59E0B" opacity="0.15"/>
<line x1="48" y1="55" x2="52" y2="55" stroke="#1C0802" stroke-width="2"/>
<line x1="34" y1="53" x2="28" y2="51" stroke="#1C0802" stroke-width="2"/>
<line x1="66" y1="53" x2="72" y2="51" stroke="#1C0802" stroke-width="2"/>
<circle cx="41" cy="55" r="3.5" fill="#3D1C08"/>
<circle cx="59" cy="55" r="3.5" fill="#3D1C08"/>
<circle cx="41" cy="55" r="1.2" fill="#0A0502"/>
<circle cx="59" cy="55" r="1.2" fill="#0A0502"/>
<circle cx="42.5" cy="53.5" r="0.9" fill="#fff"/>
<circle cx="60.5" cy="53.5" r="0.9" fill="#fff"/>
<path d="M42 65 Q50 72 58 65" fill="none" stroke="#5A2E10" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="34" cy="63" r="5" fill="#C07040" opacity="0.35"/>
<circle cx="66" cy="63" r="5" fill="#C07040" opacity="0.35"/>
</svg>`);

/* ── 8. Free Spirit ── flower crown, warm skin, pink outfit, happy ── */
const a8 = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#FCE7F3"/>
<rect x="18" y="78" width="64" height="22" rx="12" fill="#EC4899"/>
<circle cx="50" cy="57" r="23" fill="#FDCFAC"/>
<path d="M27 52 Q20 74 26 90" stroke="#92400E" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M73 52 Q80 74 74 90" stroke="#92400E" stroke-width="14" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="57" r="23" fill="#FDCFAC"/>
<ellipse cx="50" cy="40" rx="22" ry="12" fill="#92400E"/>
<ellipse cx="42" cy="35" rx="9" ry="7" fill="#FDCFAC"/>
<circle cx="32" cy="34" r="6" fill="#FDE68A"/>
<circle cx="32" cy="34" r="3.5" fill="#F59E0B"/>
<circle cx="42" cy="28" r="6" fill="#FCA5A5"/>
<circle cx="42" cy="28" r="3.5" fill="#EF4444"/>
<circle cx="53" cy="26" r="7" fill="#BAE6FD"/>
<circle cx="53" cy="26" r="4" fill="#38BDF8"/>
<circle cx="64" cy="29" r="6" fill="#BBF7D0"/>
<circle cx="64" cy="29" r="3.5" fill="#22C55E"/>
<circle cx="73" cy="36" r="5" fill="#FDE68A"/>
<circle cx="73" cy="36" r="3" fill="#F59E0B"/>
<circle cx="42" cy="53" r="4.5" fill="#fff"/>
<circle cx="58" cy="53" r="4.5" fill="#fff"/>
<circle cx="43" cy="54" r="3" fill="#9333EA"/>
<circle cx="59" cy="54" r="3" fill="#9333EA"/>
<circle cx="43" cy="54" r="1.2" fill="#1C0842"/>
<circle cx="59" cy="54" r="1.2" fill="#1C0842"/>
<circle cx="44.5" cy="52.5" r="1" fill="#fff"/>
<circle cx="60.5" cy="52.5" r="1" fill="#fff"/>
<path d="M40 64 Q50 76 60 64" fill="none" stroke="#C2666A" stroke-width="3" stroke-linecap="round"/>
<path d="M43 66 Q50 72 57 66" fill="#fff"/>
<circle cx="33" cy="62" r="7" fill="#FB7185" opacity="0.5"/>
<circle cx="67" cy="62" r="7" fill="#FB7185" opacity="0.5"/>
</svg>`);

export const AVATARS = [
  { id: 'outora-01', label: 'Wanderer',    bg: '#FDDCB5', src: a1 },
  { id: 'outora-02', label: 'Stargazer',   bg: '#EDE9FE', src: a2 },
  { id: 'outora-03', label: 'Sunny',       bg: '#FEF9C3', src: a3 },
  { id: 'outora-04', label: 'Chill',       bg: '#DBEAFE', src: a4 },
  { id: 'outora-05', label: 'Explorer',    bg: '#D1FAE5', src: a5 },
  { id: 'outora-06', label: 'Nite Owl',    bg: '#E0E7FF', src: a6 },
  { id: 'outora-07', label: 'Bookworm',    bg: '#FEF3C7', src: a7 },
  { id: 'outora-08', label: 'Free Spirit', bg: '#FCE7F3', src: a8 },
];

export function getAvatarById(avatarId) {
  return AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
}
