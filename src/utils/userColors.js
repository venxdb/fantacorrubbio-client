export const ACCENT_PALETTE = ['#059669', '#F59E0B', '#6366F1', '#EC4899', '#3B82F6', '#22C55E', '#EF4444', '#A855F7', '#F97316', '#14B8A6'];

// Assegnazione fissa per gli utenti reali, cosi' ognuno ha sempre lo stesso colore
// su tutte le pagine (Classifica, Tutte le Rose, Selezione Dealer).
const FIXED_USER_COLORS = {
  dre: '#22C55E',
  bottu: '#F59E0B',
  lore: '#3B82F6',
  venxdb: '#FBBF24',
  edo: '#6366F1',
  zane: '#059669',
  ste: '#EC4899',
  savo: '#F97316',
};

export const getUserColor = (username) => {
  if (!username) return ACCENT_PALETTE[0];
  if (FIXED_USER_COLORS[username]) return FIXED_USER_COLORS[username];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_PALETTE[Math.abs(hash) % ACCENT_PALETTE.length];
};

export const darkenColor = (hex, amount = 0.3) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.round(((num >> 16) & 0xff) * (1 - amount));
  const g = Math.round(((num >> 8) & 0xff) * (1 - amount));
  const b = Math.round((num & 0xff) * (1 - amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
