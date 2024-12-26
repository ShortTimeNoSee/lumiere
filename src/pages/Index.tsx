import { useState } from "react";
import { Header } from "@/components/Header";
import { MasonryContainer } from "@/components/masonry/MasonryContainer";
import { PinModal } from "@/components/PinModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const [selectedPin, setSelectedPin] = useState(null);
  const { user } = useAuth();

  const { data: pins = [] } = useQuery({
    queryKey: ['pins'],
    queryFn: async () => {
      const query = supabase
        .from('pins')
        .select(`
          *,
          creator:profiles!pins_creator_id_fkey(*),
          likes:likes(count),
          comments:comments(count),
          user_liked:likes!inner(user_id)
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
        comments: pin.comments[0]?.count || 0,
        hasLiked: user ? pin.user_liked.some(like => like.user_id === user.id) : false
      }));
    },
    refetchOnWindowFocus: false,
  });

  const handlePinClick = (pin: any) => {
    setSelectedPin(pin);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto">
        <MasonryContainer
          pins={pins}
          onPinClick={handlePinClick}
          onProfileClick={() => {}} // This prop is handled internally by PinModal now
        />
      </main>
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
      />
    </div>
  );
}