// Genera las paletas descargables a partir de src/data/tokens.json.
// Se ejecuta antes de cada build (npm run build) y con `npm run paletas`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const tokens = JSON.parse(readFileSync(new URL('../src/data/tokens.json', import.meta.url), 'utf8'));
const out = new URL('../public/descargas/paleta/', import.meta.url);
mkdirSync(out, { recursive: true });

const prim = tokens.color.tokens.filter((t) => typeof t.value === 'string');
const byName = new Map(tokens.color.tokens.map((t) => [t.name, t]));
const resolve = (name, theme) => {
  const v = byName.get(name).value;
  const s = typeof v === 'string' ? v : (v[theme] ?? v.light);
  const m = /^\{(.+)\}$/.exec(s);
  return m ? resolve(m[1], theme) : s;
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const title = tokens.name;

// GIMP / Inkscape / Krita
const gpl = [`GIMP Palette`, `Name: ${title}`, `Columns: 10`, `#`, ...prim.map((t) => `${rgb(t.value).map((n) => String(n).padStart(3)).join(' ')}\t${t.name}`)].join('\n') + '\n';
writeFileSync(new URL('paleta.gpl', out), gpl);

// Adobe Swatch Exchange (ASE 1.0)
const blocks = [];
const str = (s) => { const b = Buffer.alloc(2 + (s.length + 1) * 2); b.writeUInt16BE(s.length + 1, 0); for (let i = 0; i < s.length; i++) b.writeUInt16BE(s.charCodeAt(i), 2 + i * 2); return b; };
const block = (type, body) => { const h = Buffer.alloc(6); h.writeUInt16BE(type, 0); h.writeUInt32BE(body.length, 2); return Buffer.concat([h, body]); };
blocks.push(block(0xc001, str(title)));
for (const t of prim) {
  const c = Buffer.alloc(4 + 12 + 2); c.write('RGB ', 0, 'ascii');
  rgb(t.value).forEach((n, i) => c.writeFloatBE(n / 255, 4 + i * 4)); c.writeUInt16BE(2, 16); // 2 = normal
  blocks.push(block(0x0001, Buffer.concat([str(t.name), c])));
}
blocks.push(block(0xc002, Buffer.alloc(0)));
const head = Buffer.alloc(12); head.write('ASEF', 0, 'ascii'); head.writeUInt16BE(1, 4); head.writeUInt16BE(0, 6); head.writeUInt32BE(blocks.length, 8);
writeFileSync(new URL('paleta.ase', out), Buffer.concat([head, ...blocks]));

// CSS con variables (escalas + tokens por función, claro y oscuro)
const css = [`/* ${title} — colores generados desde tokens.json */`, ':root {', ...prim.map((t) => `  --${t.name}: ${t.value};`),
  ...tokens.color.tokens.filter((t) => typeof t.value !== 'string').map((t) => `  --${t.name}: ${resolve(t.name, 'light')};`), '}',
  '[data-theme="dark"] {', ...tokens.color.tokens.filter((t) => typeof t.value !== 'string').map((t) => `  --${t.name}: ${resolve(t.name, 'dark')};`), '}'].join('\n') + '\n';
writeFileSync(new URL('colores.css', out), css);

// JSON simple { nombre: hex } para otras herramientas
const json = { primitivos: Object.fromEntries(prim.map((t) => [t.name, t.value])),
  claro: Object.fromEntries(tokens.color.tokens.filter((t) => typeof t.value !== 'string').map((t) => [t.name, resolve(t.name, 'light')])),
  oscuro: Object.fromEntries(tokens.color.tokens.filter((t) => typeof t.value !== 'string').map((t) => [t.name, resolve(t.name, 'dark')])) };
writeFileSync(new URL('colores.json', out), JSON.stringify(json, null, 2) + '\n');
writeFileSync(new URL('tokens.json', out), readFileSync(new URL('../src/data/tokens.json', import.meta.url)));
console.log(`Paletas generadas: ${prim.length} colores base.`);
