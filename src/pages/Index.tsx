import { useState } from "react";
import { Header } from "@/components/Header";
import { PinCard } from "@/components/PinCard";
import { PinModal } from "@/components/PinModal";

// Temporary data for demonstration
const DEMO_PINS = [
  {
    id: 1,
    title: "Beautiful Workspace",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "A clean and minimal workspace setup",
    isAd: false,
    width: 1200,
    height: 800
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
    isAd: false,
    width: 1600,
    height: 900
  },
];

const Index = () => {
  const [selectedPin, setSelectedPin] = useState<typeof DEMO_PINS[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4">
        <div className="masonry-grid">
          {DEMO_PINS.map((pin) => (
            <PinCard
              key={pin.id}
              imageUrl={pin.imageUrl}
              title={pin.title}
              description={pin.description}
              isAd={pin.isAd}
              advertiser={pin.advertiser}
              width={pin.width}
              height={pin.height}
              onClick={() => setSelectedPin(pin)}
            />
          ))}
        </div>
      </main>
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
      />
    </div>
  );
};

export default Index;