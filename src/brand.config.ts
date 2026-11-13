/**
 * Configuración de marca. Cuando cambie el nombre o el logo, edita SOLO este archivo
 * (y reemplaza los SVG en src/assets/logos y public/descargas/logos).
 */
export const brand = {
  /** Nombre completo tal como se muestra en títulos. */
  name: 'Proyecto Cicerón',
  /** Nombre corto (wordmark). */
  shortName: 'Cicerón',
  /** true mientras nombre y logo sean provisionales: muestra un aviso en el manual. */
  provisional: true,
  tagline: 'Poderoso. Práctico. Para todos.',
  description:
    'Una aplicación de diseño gráfico nativa de escritorio, cuyo enfoque se centra en la simpleza de uso.',
  /** Archivos del logo (nombre de archivo dentro de src/assets/logos). */
  logos: {
    color: 'ciceron-logo-color.svg',
    claro: 'ciceron-logo-claro.svg',
    monoOscuro: 'ciceron-logo-mono-oscuro.svg',
    monoClaro: 'ciceron-logo-mono-claro.svg',
    monogramaColor: 'ciceron-monograma-color.svg',
    monogramaClaro: 'ciceron-monograma-claro.svg',
    monogramaMonoOscuro: 'ciceron-monograma-mono-oscuro.svg',
    monogramaMonoClaro: 'ciceron-monograma-mono-claro.svg',
  },
  /** Tipografías del logo (solo dentro del logo). */
  logoFonts: { monogram: 'PT Serif Bold', wordmark: 'Alumni Sans SC', descriptor: 'Rubik' },
  /** Versión del manual. */
  version: '0.1 · noviembre de 2026',
} as const;

export type LogoKey = keyof typeof brand.logos;
