import type { Prize } from '../types';

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Agenda', color: '#EF1218', probability: 3 },
  { id: '2', label: 'Termo', color: '#003DA5', probability: 3 },
  { id: '3', label: 'Sombrilla', color: '#FF6B35', probability: 2.5 },
  { id: '4', label: 'Chaqueta cortavientos', color: '#1A57C8', probability: 2 },
  { id: '5', label: 'Kit uniempresarial', color: '#26CE13', probability: 1.5 },
  { id: '6', label: 'Media beca Virtual', color: '#002A75', probability: 0.8 },
  { id: '7', label: 'Beca Presencial', color: '#e40f2f', probability: 0.5 },
];
