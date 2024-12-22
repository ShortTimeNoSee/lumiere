import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { PinModal } from '@/components/PinModal';

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

// This will be replaced with actual API calls
const mockSearch = async (query: string, category: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEMO_PINS.filter(pin => 
    pin.title.toLowerCase().includes(query.toLowerCase()) ||
    pin.description.toLowerCase().includes(query.toLowerCase())
  );
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'images';
  const [selectedPin, setSelectedPin] = useState(null);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query, category],
    queryFn: () => mockSearch(query, category),
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
          <TabsList>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-6">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <MasonryGrid
                pins={results}
                onPinClick={setSelectedPin}
              />
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