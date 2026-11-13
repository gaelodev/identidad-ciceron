/**
 * Ilustración de marca: degradado de malla. Se construye con manchas de color (círculos)
 * muy desenfocadas sobre un color base. Función pura: devuelve el SVG como texto,
 * para usarla en el componente GradientArt y en el script que genera las descargas.
 */
export type BrandColor = 'orange-500' | 'orange-400' | 'orange-300' | 'brand-peach' | 'brand-deep' | 'gray-0';
/** x, y en % del ancho y alto; r en % de la escala (media geométrica de ancho y alto). */
export interface Blob { x: number; y: number; r: number; color: BrandColor }
export interface Preset { base: BrandColor; blobs: Blob[]; monogram: 'claro' | 'color'; blur?: number }

export const presets = {
  /** Naranja cálido: splash, banners, portadas. */
  naranja: {
    base: 'orange-500',
    monogram: 'claro',
    blobs: [
      { x: 60, y: -10, r: 35, color: 'orange-300' },
      { x: 95, y: 10, r: 32, color: 'brand-peach' },
      { x: 10, y: 20, r: 29, color: 'orange-500' },
      { x: 0, y: 105, r: 40, color: 'orange-300' },
      { x: 30, y: 85, r: 21, color: 'orange-400' },
      { x: 85, y: 85, r: 29, color: 'orange-500' },
      { x: 50, y: 52, r: 15, color: 'brand-deep' },
    ],
  },
  /** Claro: blanco que se calienta hacia abajo. Fondos de publicaciones y portadas con texto oscuro. */
  claro: {
    base: 'gray-0',
    monogram: 'color',
    blur: 1.5,
    blobs: [
      { x: -5, y: 110, r: 30, color: 'orange-400' },
      { x: 20, y: 114, r: 30, color: 'orange-300' },
      { x: 45, y: 110, r: 30, color: 'orange-400' },
      { x: 70, y: 114, r: 30, color: 'orange-300' },
      { x: 100, y: 110, r: 32, color: 'orange-500' },
      { x: 30, y: 110, r: 12, color: 'brand-deep' },
    ],
  },
} satisfies Record<string, Preset>;
export type PresetName = keyof typeof presets;

export interface GradientOptions {
  width: number;
  height: number;
  preset?: PresetName;
  blobs?: Blob[];
  base?: BrandColor;
  /** Multiplicador del desenfoque (1 = normal). */
  blur?: number;
  /** SVG del monograma (texto). Si se omite, no se dibuja. */
  monogramSvg?: string;
  /** Alto del monograma en fracción del alto del lienzo. */
  monogramSize?: number;
  /** Resuelve un nombre de color a hexadecimal. */
  color: (name: BrandColor) => string;
  id: string;
  label?: string;
}

export function gradientSvg(o: GradientOptions): string {
  const p = presets[o.preset ?? 'naranja'];
  const { width: w, height: h } = o;
  const scale = Math.sqrt(w * h);
  const blobs = o.blobs ?? p.blobs;
  const base = o.base ?? p.base;
  const std = Math.round(scale * 0.11 * (o.blur ?? 1) * ((p as Preset).blur ?? 1));
  const circles = blobs
    .map((b) => `<circle cx="${(b.x / 100) * w}" cy="${(b.y / 100) * h}" r="${(b.r / 100) * scale}" fill="${o.color(b.color)}"/>`)
    .join('');
  let mono = '';
  if (o.monogramSvg) {
    const vb = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(o.monogramSvg);
    const ratio = vb ? parseFloat(vb[1]) / parseFloat(vb[2]) : 1;
    const mh = h * (o.monogramSize ?? 0.46);
    const mw = mh * ratio;
    mono = o.monogramSvg
      .replace(/<\?xml[^>]*>/, '')
      .replace(/<title>[^<]*<\/title>/, '')
      .replace(/width="[\d.]+" height="[\d.]+"/, `x="${(w - mw) / 2}" y="${(h - mh) / 2}" width="${mw}" height="${mh}"`);
  }
  const label = o.label ?? 'Degradado de la marca';
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${a11y}>`
    + `<defs><filter id="${o.id}" filterUnits="userSpaceOnUse" x="${-w}" y="${-h}" width="${3 * w}" height="${3 * h}" color-interpolation-filters="sRGB">`
    + `<feGaussianBlur stdDeviation="${std}"/></filter><clipPath id="${o.id}-c"><rect width="${w}" height="${h}"/></clipPath></defs>`
    + `<g clip-path="url(#${o.id}-c)"><rect width="${w}" height="${h}" fill="${o.color(base)}"/><g filter="url(#${o.id})">${circles}</g></g>${mono}</svg>`;
}
