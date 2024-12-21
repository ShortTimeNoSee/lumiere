import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PinCard } from "@/components/PinCard";
import { PinModal } from "@/components/PinModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Temporary data for demonstration
const DEMO_USER = {
  username: "johndoe",
  name: "John Doe",
  bio: "Digital creator and photography enthusiast",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
};

const DEMO_PINS = [
  {
    id: 1,
    title: "My Workspace",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "Clean and minimal workspace setup"
  },
  {
    id: 2,
    title: "Tech Innovation",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    description: "The future of technology"
  },
];

const Profile = () => {
  const [selectedPin, setSelectedPin] = useState<typeof DEMO_PINS[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={DEMO_USER.avatar} alt={DEMO_USER.name} />
              <AvatarFallback>{DEMO_USER.name[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-2">{DEMO_USER.name}</h1>
            <p className="text-muted-foreground mb-4">@{DEMO_USER.username}</p>
            <p className="text-center max-w-md mb-6">{DEMO_USER.bio}</p>
            <Button variant="outline">Edit Profile</Button>
          </div>
          
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

export default Profile;