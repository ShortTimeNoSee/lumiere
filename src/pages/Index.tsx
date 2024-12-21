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
    description: "A clean and minimal workspace setup"
  },
  {
    id: 2,
    title: "Tech Innovation",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    description: "The future of technology"
  },
  {
    id: 3,
    title: "Modern Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Modern software development workspace"
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