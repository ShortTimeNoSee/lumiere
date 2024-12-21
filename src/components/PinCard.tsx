import { Card } from "@/components/ui/card";

interface PinCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  isAd?: boolean;
  advertiser?: string;
  width?: number;
  height?: number;
  onClick: () => void;
}

export function PinCard({
  imageUrl,
  title,
  description,
  isAd,
  advertiser,
  width,
  height,
  onClick
}: PinCardProps) {
  const aspectRatio = height && width ? height / width : 1;

  return (
    <Card 
      className="pin-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="pin-image transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: `${width}/${height}` }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-medium mb-2">{title}</h3>
          {description && (
            <p className="text-white/90 text-sm line-clamp-2">{description}</p>
          )}
        </div>
        {isAd && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Ad
          </div>
        )}
        {isAd && advertiser && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {advertiser}
          </div>
        )}
      </div>
    </Card>
  );
}