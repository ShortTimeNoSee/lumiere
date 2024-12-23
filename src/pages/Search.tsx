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

const performSearch = async (query: string, params: URLSearchParams) => {
  // This would be replaced with an actual API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  const category = params.get('category') || 'images';
  const exact = params.get('exact');
  const exclude = params.get('exclude');
  const author = params.get('author');
  const type = params.get('type');

  return DEMO_PINS.filter(pin => {
    let matches = true;
    
    // Basic search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      matches = searchTerms.every(term => 
        pin.title.toLowerCase().includes(term) ||
        pin.description?.toLowerCase().includes(term)
      );
    }

    // Exact match
    if (exact && !pin.title.toLowerCase().includes(exact.toLowerCase())) {
      matches = false;
    }

    // Exclude terms
    if (exclude) {
      const excludeTerms = exclude.toLowerCase().split(',');
      if (excludeTerms.some(term => 
        pin.title.toLowerCase().includes(term) ||
        pin.description?.toLowerCase().includes(term)
      )) {
        matches = false;
      }
    }

    // Author filter
    if (author && pin.creator?.name.toLowerCase() !== author.toLowerCase()) {
      matches = false;
    }

    // File type filter (in a real app, we'd extract this from the image URL)
    if (type && !pin.imageUrl.toLowerCase().endsWith(type.toLowerCase())) {
      matches = false;
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