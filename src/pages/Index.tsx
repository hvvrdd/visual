import { useState } from 'react';
import { Character } from '@/types/character';
import { ScraperPanel } from '@/components/ScraperPanel';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterComparison } from '@/components/CharacterComparison';
import { DataVisualization } from '@/components/DataVisualization';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCSV } from '@/utils/csvExport';
import { Download, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const handleDataScraped = (scrapedCharacters: Character[]) => {
    setCharacters(scrapedCharacters);
  };

  const handleToggleSelect = (character: Character) => {
    setSelectedCharacters(prev => {
      const isSelected = prev.some(c => c.index_character === character.index_character);
      if (isSelected) {
        return prev.filter(c => c.index_character !== character.index_character);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, character];
    });
  };

  const handleExport = () => {
    exportToCSV(characters);
  };

  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.hero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || char.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="halftone-bg fixed inset-0 opacity-30 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-7xl font-black text-gradient">
            База данных персонажей Spider-Verse
          </h1>
          <p className="text-xl text-muted-foreground">
            Собирайте, анализируйте и сравнивайте персонажей из Into the Spider-Verse
          </p>
        </header>

        <ScraperPanel onDataScraped={handleDataScraped} />

        {characters.length > 0 && (
          <Tabs defaultValue="gallery" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="gallery">Галерея</TabsTrigger>
                <TabsTrigger value="comparison">Сравнение</TabsTrigger>
                <TabsTrigger value="analytics">Аналитика</TabsTrigger>
              </TabsList>
              
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Экспорт CSV
              </Button>
            </div>

            <TabsContent value="gallery" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск персонажей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterGroup} onValueChange={setFilterGroup}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Фильтр по группе" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все группы</SelectItem>
                    <SelectItem value="Anime">Anime</SelectItem>
                    <SelectItem value="Games">Games</SelectItem>
                    <SelectItem value="Cartoons">Cartoons</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                Выберите до 4 персонажей для сравнения ({selectedCharacters.length}/4)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCharacters.map(character => (
                  <CharacterCard
                    key={character.index_character}
                    character={character}
                    isSelected={selectedCharacters.some(c => c.index_character === character.index_character)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <CharacterComparison characters={selectedCharacters} />
            </TabsContent>

            <TabsContent value="analytics">
              <DataVisualization characters={characters} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
