import { Character } from '@/types/character';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onToggleSelect?: (character: Character) => void;
}

export const CharacterCard = ({ character, isSelected, onToggleSelect }: CharacterCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:scale-105 hover:shadow-xl relative">
      {onToggleSelect && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(character)}
            className="bg-background border-2"
          />
        </div>
      )}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-b from-muted to-background">
        <img
          src={character.url || '/placeholder.svg'}
          alt={character.hero}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight">{character.hero}</h3>
          <Badge variant="secondary" className="shrink-0">
            {character.group}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{character.name}</p>
        {character.stats && (
          <div className="grid grid-cols-2 gap-1 text-xs pt-2 border-t">
            {Object.entries(character.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{key}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
