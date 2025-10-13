import Papa from 'papaparse';
import { Character } from '@/types/character';

export const exportToCSV = (characters: Character[], filename: string = 'spiderverse-characters.csv') => {
  const csvData = characters.map(char => ({
    index_character: char.index_character,
    name: char.name,
    hero: char.hero,
    url: char.url,
    group: char.group,
    strength: char.stats?.strength || '',
    agility: char.stats?.agility || '',
    intelligence: char.stats?.intelligence || '',
    webSlinging: char.stats?.webSlinging || '',
    combat: char.stats?.combat || ''
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
