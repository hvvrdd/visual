import { Character } from '@/types/character';

export class WikiScraper {
  static async scrapeCharacters(url: string): Promise<{ success: boolean; error?: string; characters?: Character[] }> {
    try {
      console.log('Fetching Spider-Verse wiki data...');
      
      // Use a CORS proxy to fetch the wiki page
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(proxyUrl + encodeURIComponent(url));
      
      if (!response.ok) {
        throw new Error('Failed to fetch wiki page');
      }

      const html = await response.text();
      const characters = this.parseCharactersFromHtml(html);

      console.log(`Successfully parsed ${characters.length} characters`);
      return { success: true, characters };
    } catch (error) {
      console.error('Error scraping wiki:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape wiki' 
      };
    }
  }

  private static parseCharactersFromHtml(html: string): Character[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const characters: Character[] = [];
    
    // Find all character links in the category page
    const characterLinks = doc.querySelectorAll('.category-page__member-link');
    
    characterLinks.forEach((link, index) => {
      const heroName = link.textContent?.trim() || 'Unknown';
      const characterUrl = (link as HTMLAnchorElement).href || '';
      
      // Try to find the thumbnail image
      const memberDiv = link.closest('.category-page__member');
      const imgElement = memberDiv?.querySelector('img');
      let imageUrl = imgElement?.getAttribute('data-src') || 
                     imgElement?.getAttribute('src') || 
                     '';
      
      // Clean up Fandom image URLs
      if (imageUrl && imageUrl.includes('fandom.com')) {
        // Remove query parameters that might cause issues
        imageUrl = imageUrl.split('?')[0];
        // Proxy Fandom images to avoid CORS issues
        imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=400&h=600&fit=cover`;
      }
      
      // If no valid image URL, use placeholder
      if (!imageUrl || imageUrl === '') {
        imageUrl = '/placeholder.svg';
      }

      // Determine group based on name or assign randomly for demo
      let group: 'Anime' | 'Games' | 'Cartoons' = 'Cartoons';
      if (heroName.includes('Peni') || heroName.includes('Anime')) {
        group = 'Anime';
      } else if (heroName.includes('Game') || heroName.includes('PS')) {
        group = 'Games';
      }

      // Extract universe/world name from character name or generate one
      const universeName = this.extractUniverseName(heroName, index);

      characters.push({
        index_character: index + 1,
        name: universeName,
        hero: heroName,
        url: imageUrl,
        group: group,
        stats: this.generateRandomStats()
      });
    });

    // If no characters found, return mock data
    if (characters.length === 0) {
      return this.getMockCharacters();
    }

    return characters;
  }

  private static extractUniverseName(heroName: string, index: number): string {
    // Map known characters to their universes
    const universeMap: Record<string, string> = {
      'Miles Morales': 'Earth-1610',
      'Peter B. Parker': 'Earth-616B',
      'Gwen Stacy': 'Earth-65',
      'Spider-Man Noir': 'Earth-90214',
      'Peni Parker': 'Earth-14512',
      'Spider-Ham': 'Earth-8311',
      'Miguel O\'Hara': 'Earth-928',
      'Jessica Drew': 'Earth-404',
    };

    for (const [key, universe] of Object.entries(universeMap)) {
      if (heroName.includes(key)) {
        return universe;
      }
    }

    return `Earth-${1000 + index}`;
  }

  private static generateRandomStats() {
    return {
      strength: Math.floor(Math.random() * 30) + 70,
      agility: Math.floor(Math.random() * 30) + 70,
      intelligence: Math.floor(Math.random() * 30) + 70,
      webSlinging: Math.floor(Math.random() * 30) + 70,
      combat: Math.floor(Math.random() * 30) + 70,
    };
  }

  private static getMockCharacters(): Character[] {
    const characters = [
      { hero: 'Miles Morales', name: 'Earth-1610', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400' },
      { hero: 'Peter B. Parker', name: 'Earth-616B', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400' },
      { hero: 'Gwen Stacy / Spider-Gwen', name: 'Earth-65', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400' },
      { hero: 'Spider-Man Noir', name: 'Earth-90214', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400' },
      { hero: 'Peni Parker', name: 'Earth-14512', group: 'Anime' as const, url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
      { hero: 'Spider-Ham / Peter Porker', name: 'Earth-8311', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400' },
      { hero: 'Miguel O\'Hara / Spider-Man 2099', name: 'Earth-928', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400' },
      { hero: 'Jessica Drew / Spider-Woman', name: 'Earth-404', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400' },
      { hero: 'Hobie Brown / Spider-Punk', name: 'Earth-138', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400' },
      { hero: 'Pavitr Prabhakar', name: 'Earth-50101', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400' },
      { hero: 'Ben Reilly / Scarlet Spider', name: 'Earth-94', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400' },
      { hero: 'Cindy Moon / Silk', name: 'Earth-616', group: 'Cartoons' as const, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
    ];

    return characters.map((char, index) => ({
      index_character: index + 1,
      ...char,
      stats: this.generateRandomStats()
    }));
  }
}
