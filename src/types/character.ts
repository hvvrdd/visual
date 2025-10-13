export interface Character {
  index_character: number;
  name: string;
  hero: string;
  url: string;
  group: 'Anime' | 'Games' | 'Cartoons';
  stats?: {
    strength?: number;
    agility?: number;
    intelligence?: number;
    webSlinging?: number;
    combat?: number;
  };
}

export interface CharacterData {
  characters: Character[];
  lastUpdated: string;
}
