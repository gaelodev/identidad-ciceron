// Genera los fondos de degradado (SVG) a partir de src/lib/gradient.ts y tokens.json.
// Se ejecuta antes de cada build. Los PNG equivalentes se exportan aparte (ver README).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gradientSvg } from '../src/lib/gradient.ts';

const tokens = JSON.parse(readFileSync(new URL('../src/data/tokens.json', import.meta.url), 'utf8'));
const hex = Object.fromEntries(tokens.color.tokens.filter((t) => typeof t.value === 'string').map((t) => [t.name, t.value]));
const logo = (f) => readFileSync(new URL(`../src/assets/logos/${f}`, import.meta.url), 'utf8');
const out = new URL('../public/descargas/fondos/', import.meta.url);
mkdirSync(out, { recursive: true });

const jobs = [
  ['fondo-naranja-1920x1080', { width: 1920, height: 1080 }],
  ['fondo-naranja-1080x1080', { width: 1080, height: 1080 }],
  ['fondo-naranja-1500x500', { width: 1500, height: 500 }],
  ['fondo-claro-1920x1080', { width: 1920, height: 1080, preset: 'claro' }],
  ['fondo-claro-1080x1080', { width: 1080, height: 1080, preset: 'claro' }],
  ['splash-1600x900', { width: 1600, height: 900, monogramSvg: logo('ciceron-monograma-claro.svg'), monogramSize: 0.27, label: 'Pantalla de carga' }],
];
for (const [name, o] of jobs) {
  const svg = gradientSvg({ ...o, color: (n) => hex[n], id: 'g' });
  writeFileSync(new URL(`${name}.svg`, out), svg);
}
console.log(`Fondos: ${jobs.length} SVG generados.`);
