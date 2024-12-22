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
    isAd: false,
    width: 1600,
    height: 900,
    creator: {
      name: "Jane Smith"
    }
  },
  {
    id: 4,
    title: "Urban Photography",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    description: "City life captured in stunning detail",
    isAd: false,
    width: 1200,
    height: 800
  },
  {
    id: 5,
    title: "Premium Headphones",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    description: "Experience music like never before",
    isAd: true,
    advertiser: "Audio Tech",
    width: 800,
    height: 1200
  },
  {
    id: 6,
    title: "Nature Escape",
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    description: "Discover the beauty of nature",
    width: 1600,
    height: 900
  },
  {
    id: 7,
    title: "Minimalist Design",
    imageUrl: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2",
    description: "Less is more in modern design",
    width: 1200,
    height: 800
  },
  {
    id: 8,
    title: "Luxury Watches",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
    description: "Timeless elegance on your wrist",
    isAd: true,
    advertiser: "Luxury Time Co.",
    width: 800,
    height: 1200
  },
  {
    id: 9,
    title: "Travel Adventures",
    imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080",
    description: "Explore the world",
    width: 1600,
    height: 900
  },
  {
    id: 10,
    title: "Culinary Arts",
    imageUrl: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
    description: "Master the art of cooking",
    width: 1200,
    height: 800
  }
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
              creator={pin.creator}
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