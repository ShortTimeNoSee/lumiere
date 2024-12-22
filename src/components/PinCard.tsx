import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface PinCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  isAd?: boolean;
  advertiser?: string;
  creator?: {
    name: string;
    avatar?: string;
  };
  width?: number;
  height?: number;
  isPremium?: boolean;
  onClick: () => void;
}

export function PinCard({
  imageUrl,
  title,
  description,
  isAd,
  advertiser,
  creator,
  width = 1,
  height = 1,
  isPremium,
  onClick
}: PinCardProps) {
  return (
    <Card 
      className="pin-card overflow-hidden cursor-pointer group relative"
      onClick={onClick}
      style={{
        '--image-width': width,
        '--image-height': height
      } as React.CSSProperties}
    >
      <div className="pin-image-container">
        <img 
          src={imageUrl} 
          alt={title}
          className="pin-image transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {isAd && <div className="ad-badge">Ad</div>}
        
        <div className="pin-overlay" />
        
        <div className="pin-content">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>
          {description && (
            <p className="text-sm text-white/90 line-clamp-2 mb-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {creator && (
                <>
                  {creator.avatar ? (
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white/80" />
                  )}
                  <span className="text-sm font-medium">{creator.name}</span>
                </>
              )}
            </div>
            
            {isPremium && (
              <Badge 
                variant="secondary"
                className="bg-gradient-to-r from-purple-600 to-orange-500"
              >
                Premium
              </Badge>
            )}
          </div>
        </div>
        
        {isAd && advertiser && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {advertiser}
          </div>
        )}
      </div>
    </Card>
  );
}