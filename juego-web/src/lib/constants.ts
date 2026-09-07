import type { Prize } from '../types';

/** Default prizes for the ruleta game — university careers */
export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Adm. de Empresas', color: '#E63946', probability: 1 },
  { id: '2', label: 'Finanzas', color: '#457B9D', probability: 1 },
  { id: '3', label: 'Ing. Industrial', color: '#2A9D8F', probability: 1 },
  { id: '4', label: 'Ing. Software', color: '#E9C46A', probability: 1 },
  { id: '5', label: 'Marketing', color: '#F4A261', probability: 1 },
  { id: '6', label: 'Neg. Internac.', color: '#1D3557', probability: 1 },
  { id: '7', label: 'Neg. Turísticos', color: '#6D597A', probability: 1 },
];
