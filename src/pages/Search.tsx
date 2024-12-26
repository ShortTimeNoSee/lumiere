import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { PinModal } from '@/components/PinModal';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const performSearch = async (query: string, params: URLSearchParams) => {
  const category = params.get('category') || 'images';
  
  if (category === 'collections') {
    const { data: collections } = await supabase
      .from('collections')
      .select(`
        *,
        creator:profiles(*),
        pins:collection_items(
          pin:pins(*)
        )
      `)
      .textSearch('name', query)
      .eq('visibility', 'public');
    
    return collections || [];
  }
  
  if (category === 'people') {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,name.ilike.%${query}%`);
    
    return profiles || [];
  }
  
  // Default to pins search
  const { data: pins } = await supabase
    .from('pins')
    .select(`
      *,
      creator:profiles(*),
      likes(count),
      comments(count)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  
  return pins || [];
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