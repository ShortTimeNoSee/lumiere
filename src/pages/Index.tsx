import { useState } from "react";
import { Header } from "@/components/Header";
import { MasonryContainer } from "@/components/masonry/MasonryContainer";
import { PinModal } from "@/components/pins/PinModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const [selectedPin, setSelectedPin] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: pins = [] } = useQuery({
    queryKey: ['pins'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pins')
        .select(`
          *,
          creator:profiles(*),
          likes(count),
          comments(count),
          user_liked:likes!inner(user_id)
        `)
        .eq('user_liked.user_id', user?.id || '')
        .order('created_at', { ascending: false });
      
      return data || [];
    },
  });

  const handlePinClick = (pin: any) => {
    setSelectedPin(pin);
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto">
        <MasonryContainer
          pins={pins}
          onPinClick={handlePinClick}
          onProfileClick={handleProfileClick}
        />
      </main>
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
        onProfileClick={handleProfileClick}
      />
    </div>
  );
}