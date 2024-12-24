import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MasonryContainer } from "@/components/masonry/MasonryContainer";
import { PinModal } from "@/components/pins/PinModal";
import { demoData } from "@/data/demo-pins";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedPin, setSelectedPin] = useState<typeof demoData[0] | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePinClick = (pin: typeof demoData[0]) => {
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
          pins={demoData}
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
};

export default Index;