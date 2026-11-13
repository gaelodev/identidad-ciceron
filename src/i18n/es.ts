/** Textos de la interfaz del manual. Para inglés, crea en.ts con las mismas claves. */
export const ui = {
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/esencia/', label: 'Esencia' },
    { href: '/logo/', label: 'Logo' },
    { href: '/color/', label: 'Color' },
    { href: '/tipografia/', label: 'Tipografía' },
    { href: '/iconografia/', label: 'Iconografía' },
    { href: '/imagenes/', label: 'Fotografía e ilustración' },
    { href: '/aplicaciones/', label: 'Aplicaciones' },
    { href: '/voz/', label: 'Voz y tono' },
    { href: '/interfaz/', label: 'Interfaz' },
    { href: '/descargas/', label: 'Descargas' },
  ],
  themeLight: 'Tema claro',
  themeDark: 'Tema oscuro',
  copy: 'Copiar',
  copied: 'Copiado',
  provisional: 'Nombre y logo provisionales: la marca final será distinta.',
  skip: 'Saltar al contenido',
  printHint: 'Para PDF: Imprimir › Guardar como PDF.',
} as const;
