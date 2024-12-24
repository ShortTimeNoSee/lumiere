import { useState } from "react";
import { Header } from "@/components/Header";
import { MasonryContainer } from "@/components/masonry/MasonryContainer";
import { PinModal } from "@/components/pins/PinModal";
import { demoData } from "@/data/demo-pins";

const Index = () => {
  const [selectedPin, setSelectedPin] = useState<typeof demoData[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto">
        <MasonryContainer
          pins={demoData}
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