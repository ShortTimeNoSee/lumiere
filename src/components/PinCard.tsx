import { Card } from "@/components/ui/card";

interface PinCardProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
}

export function PinCard({ imageUrl, title, onClick }: PinCardProps) {
  return (
    <Card 
      className="pin-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="pin-image transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <h3 className="text-white font-medium truncate">{title}</h3>
        </div>
      </div>
    </Card>
  );
}