import raw from '../data/tokens.json';

type ThemeValue = string | { light: string; dark?: string };
export interface Token { name: string; value: ThemeValue; usage?: string }
export interface TypeStyle { name: string; fontSize: string; lineHeight: string | number; fontWeight: number; family?: string; sample?: string; usage?: string }
interface Tokens {
  color: { themes: { id: string; name: string }[]; tokens: Token[] };
  type: { families: Record<string, string>; groups: { name: string; family: string; styles: TypeStyle[] }[]; fonts: { family: string; file: string; weight: string; style: string }[] };
  spacing: { tokens: Token[] }; radius: { tokens: Token[] }; shadow: { tokens: Token[] };
  stroke: { tokens: Token[] }; size: { tokens: Token[] };
}
export const tokens = raw as unknown as Tokens;

const byName = new Map(tokens.color.tokens.map((t) => [t.name, t]));
export type Theme = 'light' | 'dark';

/** Valor de un token de color ya resuelto a hexadecimal (sigue los alias {nombre}). */
export function resolveColor(name: string, theme: Theme = 'light', depth = 0): string {
  const t = byName.get(name);
  if (!t || depth > 16) throw new Error(`Token de color desconocido: ${name}`);
  const v = typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value.light);
  const alias = /^\{(.+)\}$/.exec(v);
  return alias ? resolveColor(alias[1], theme, depth + 1) : v;
}
export function aliasOf(name: string, theme: Theme = 'light'): string | null {
  const t = byName.get(name);
  if (!t) return null;
  const v = typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value.light);
  const m = /^\{(.+)\}$/.exec(v);
  return m ? m[1] : null;
}
export const isPrimitive = (t: Token) => typeof t.value === 'string';
export const colorTokens = tokens.color.tokens;

function lum(hex: string): number {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
/** Relación de contraste WCAG entre dos colores hexadecimales. */
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** Hoja de estilo con todos los tokens como variables CSS (claro en :root, oscuro en [data-theme=dark]). */
export function tokensCss(): string {
  const val = (v: ThemeValue, th: Theme) => {
    const s = typeof v === 'string' ? v : (v[th] ?? v.light);
    return s.replace(/^\{(.+)\}$/, 'var(--$1)');
  };
  const light: string[] = [];
  const dark: string[] = [];
  for (const t of [...tokens.color.tokens, ...tokens.shadow.tokens]) {
    light.push(`--${t.name}:${val(t.value, 'light')};`);
    if (typeof t.value !== 'string') dark.push(`--${t.name}:${val(t.value, 'dark')};`);
  }
  const plain = [...tokens.spacing.tokens, ...tokens.radius.tokens, ...tokens.stroke.tokens, ...tokens.size.tokens].map((t) => `--${t.name}:${t.value as string};`);
  const fam = Object.entries(tokens.type.families).map(([k, v]) => `--font-${k}:${v};`);
  return `:root{${light.join('')}${plain.join('')}${fam.join('')}}[data-theme="dark"]{${dark.join('')}}`;
}

export function typeStyles(): (TypeStyle & { group: string; familyKey: string })[] {
  return tokens.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, group: g.name, familyKey: s.family ?? g.family })));
}
export function px(v: string | number): number { return typeof v === 'number' ? v : parseFloat(v); }
