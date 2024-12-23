import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { MasonryGrid } from "@/components/MasonryGrid";
import { PinModal } from "@/components/PinModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const DEMO_COLLECTIONS = [
  {
    id: 1,
    title: "Workspace Inspiration",
    pins: DEMO_PINS,
    coverImage: DEMO_PINS[0].imageUrl
  }
];

const Profile = () => {
  const [selectedPin, setSelectedPin] = useState<typeof DEMO_PINS[0] | null>(null);
  const [activeTab, setActiveTab] = useState("uploads");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src={DEMO_USER.avatar} 
                alt={DEMO_USER.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{DEMO_USER.name}</h1>
            <p className="text-muted-foreground mb-4">@{DEMO_USER.username}</p>
            <p className="text-center max-w-md mb-6">{DEMO_USER.bio}</p>
            <div className="flex gap-4">
              <Button variant="outline">Edit Profile</Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                onClick={() => window.location.href = '/upgrade'}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="uploads">Uploads</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="uploads">
              <MasonryGrid
                pins={DEMO_PINS}
                onPinClick={setSelectedPin}
              />
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_COLLECTIONS.map((collection) => (
                  <div key={collection.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img 
                      src={collection.coverImage} 
                      alt={collection.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white text-xl font-bold">{collection.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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