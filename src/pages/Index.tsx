import { useState } from "react";
import { Header } from "@/components/Header";
import { MasonryContainer } from "@/components/masonry/MasonryContainer";
import { PinModal } from "@/components/pins/PinModal";

const DEMO_PINS = [
  {
    id: "1",
    title: "Beautiful Workspace",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "A clean and minimal workspace setup",
    creator: {
      id: "1",
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    likes: 42,
    comments: []
  },
  {
    id: "2",
    title: "Premium Coffee Experience",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    description: "Start your day with premium coffee",
    creator: {
      id: "2",
      name: "John Doe"
    },
    likes: 15,
    comments: []
  },
  {
    id: "3",
    title: "Modern Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Modern software development workspace",
    creator: {
      id: "3",
      name: "Jane Smith"
    },
    likes: 28,
    comments: []
  },
  {
    id: 4,
    title: "Urban Photography",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    description: "City life captured in stunning detail",
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
    width: 3000,
    height: 2000
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
  },
  {
    id: 11,
    title: "Mountain Vista",
    imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
    description: "Breathtaking mountain landscapes",
    width: 2400,
    height: 1600
  },
  {
    id: 12,
    title: "Urban Architecture",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e",
    description: "Modern architectural marvels",
    width: 800,
    height: 1200
  },
  {
    id: 13,
    title: "Tech Gadgets",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    description: "Latest in technology",
    isAd: true,
    advertiser: "Tech Store",
    width: 1600,
    height: 900
  },
  {
    id: 14,
    title: "Artistic Expression",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
    description: "Contemporary art pieces",
    width: 1200,
    height: 800
  },
  {
    id: 15,
    title: "Fitness Goals",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    description: "Achieve your fitness dreams",
    width: 800,
    height: 1200
  },
  {
    id: 16,
    title: "Urban Exploration",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    description: "Discover hidden city gems",
    width: 1920,
    height: 1080
  },
  {
    id: 17,
    title: "Minimal Tech Setup",
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
    description: "Clean and efficient workspace",
    width: 1200,
    height: 800
  },
  {
    id: 18,
    title: "Nature Photography",
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    description: "Stunning natural landscapes",
    width: 2400,
    height: 1600
  },
  {
    id: 19,
    title: "Street Art Culture",
    imageUrl: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212",
    description: "Urban art expressions",
    width: 1600,
    height: 2400
  },
  {
    id: 20,
    title: "Modern Architecture",
    imageUrl: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a",
    description: "Contemporary building designs",
    width: 1920,
    height: 1280
  }
].map(pin => ({
  ...pin,
  id: String(pin.id),
  creator: pin.creator || {
    id: "default",
    name: "Jane Smith"
  }
}));

const Index = () => {
  const [selectedPin, setSelectedPin] = useState<typeof DEMO_PINS[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto">
        <MasonryContainer
          pins={DEMO_PINS}
          onPinClick={setSelectedPin}
        />
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
