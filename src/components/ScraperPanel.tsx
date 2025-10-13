import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { WikiScraper } from '@/utils/WikiScraper';
import { Character } from '@/types/character';
import { Search, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScraperPanelProps {
  onDataScraped: (characters: Character[]) => void;
}

export const ScraperPanel = ({ onDataScraped }: ScraperPanelProps) => {
  const [url, setUrl] = useState('https://intothespiderverse.fandom.com/wiki/Category:Characters');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsLoading(true);
    setProgress(10);

    try {
      setProgress(30);
      const result = await WikiScraper.scrapeCharacters(url);
      setProgress(70);

      if (result.success && result.characters) {
        onDataScraped(result.characters);
        
        toast({
          title: "Успешно",
          description: `Загружено ${result.characters.length} персонажей Spider-Verse`,
        });
        setProgress(100);
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось собрать данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сборе данных",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Сборщик данных Spider-Verse</h2>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Сбор данных о персонажах из вики Spider-Verse. Сборщик получит имена персонажей, изображения и создаст сравнительную статистику.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Введите URL вики"
            disabled={isLoading}
          />
          <Button 
            onClick={handleScrape}
            disabled={isLoading}
            className="shrink-0"
          >
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? 'Загрузка...' : 'Загрузить данные'}
          </Button>
        </div>
        
        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Сбор данных о персонажах...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
