import { useState } from "react";
import { Header } from "@/components/Header";
import { MasonryGrid } from "@/components/MasonryGrid";
import { PinModal } from "@/components/pins/PinModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Index() {
  const [selectedPin, setSelectedPin] = useState(null);
  const { user } = useAuth();

  const { data: pins = [], isLoading } = useQuery({
    queryKey: ['pins'],
    queryFn: async () => {
      const query = supabase
        .from('pins')
        .select(`
          *,
          creator:profiles!pins_creator_id_fkey(*),
          likes(count),
          user_liked:likes!inner(user_id),
          comments(
            *,
            user:profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching pins:', error);
        return [];
      }
      
      return data.map(pin => ({
        ...pin,
        likes: pin.likes[0]?.count || 0,
        hasLiked: user ? pin.user_liked.some(like => like.user_id === user.id) : false,
        comments: pin.comments || []
      }));
    },
    refetchOnWindowFocus: false,
  });

  const handlePinClick = (pin: any) => {
    setSelectedPin(pin);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MasonryGrid
          pins={pins}
          onPinClick={handlePinClick}
        />
      </main>
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
        onProfileClick={(userId) => navigate(`/profile/${userId}`)}
      />
    </div>
  );
}