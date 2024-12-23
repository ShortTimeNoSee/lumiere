import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { PinModal } from '@/components/PinModal';
import { Skeleton } from '@/components/ui/skeleton';

// Demo data for search results
const DEMO_PINS = [
  {
    id: 1,
    title: "Beautiful Workspace",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "A clean and minimal workspace setup",
    width: 1200,
    height: 800,
    creator: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    }
  },
  {
    id: 2,
    title: "Premium Coffee Experience",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    description: "Start your day with premium coffee",
    isAd: true,
    advertiser: "Coffee Co.",
    width: 800,
    height: 1200
  },
  {
    id: 3,
    title: "Modern Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Modern software development workspace",
    width: 1600,
    height: 900,
    creator: {
      name: "Jane Smith"
    }
  }
];

const fuzzyMatch = (text: string, query: string): boolean => {
  text = text.toLowerCase();
  query = query.toLowerCase();
  
  if (text.includes(query)) return true;
  
  const words = query.split(' ').filter(word => word.length > 0);
  return words.some(word => {
    return text.split(' ').some(textWord => 
      textWord.includes(word) || word.includes(textWord)
    );
  });
};

const performSearch = async (query: string, params: URLSearchParams) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const category = params.get('category') || 'images';
  const exact = params.get('exact');
  const exclude = params.get('exclude');
  const author = params.get('author');
  const type = params.get('type');

  return DEMO_PINS.filter(pin => {
    if (!query && !exact && !exclude && !author && !type) return true;
    
    let matches = true;
    const searchText = `${pin.title} ${pin.description || ''}`.toLowerCase();
    
    if (query && !fuzzyMatch(searchText, query)) {
      matches = false;
    }

    if (exact && !searchText.includes(exact.toLowerCase())) {
      matches = false;
    }

    if (exclude) {
      const excludeTerms = exclude.toLowerCase().split(',');
      if (excludeTerms.some(term => searchText.includes(term.trim()))) {
        matches = false;
      }
    }

    if (author) {
      const authors = author.toLowerCase().split(',');
      if (!pin.creator || !authors.some(a => 
        pin.creator.name.toLowerCase().includes(a.trim())
      )) {
        matches = false;
      }
    }

    if (type) {
      const types = type.toLowerCase().split(',');
      if (!types.some(t => pin.imageUrl.toLowerCase().endsWith(t.trim()))) {
        matches = false;
      }
    }

    return matches;
  });
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'images';
  const [selectedPin, setSelectedPin] = useState(null);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query, category, searchParams.toString()],
    queryFn: () => performSearch(query, searchParams),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">
          Search results for "{query}"
        </h1>

        <Tabs defaultValue={category} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[200px] rounded-lg" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <MasonryGrid
                pins={results}
                onPinClick={setSelectedPin}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No results found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="collections">Collections search coming soon</TabsContent>
          <TabsContent value="people">People search coming soon</TabsContent>
          <TabsContent value="trending">Trending search coming soon</TabsContent>
        </Tabs>
      </main>

      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
      />
    </div>
  );
}
