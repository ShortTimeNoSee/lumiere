import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useState } from "react";

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
  width,
  height,
  isPremium,
  onClick
}: PinCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const aspectRatio = height && width ? height / width : 1;

  return (
    <Card 
      className="overflow-hidden cursor-pointer group relative w-full transform-gpu transition-transform duration-200 hover:z-10 hover:scale-[1.02] hover:-translate-y-1"
      onClick={onClick}
      style={{ 
        willChange: 'transform',
        contain: 'paint layout'
      }}
    >
      <div 
        className="relative"
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
      >
        <img 
          src={imageUrl} 
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
        
        {isAd && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-black/60">
            Ad
          </Badge>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-xs sm:text-sm font-semibold text-white mb-1 line-clamp-2">{title}</h3>
          {description && (
            <p className="text-xs text-white/90 line-clamp-2 mb-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {creator && (
                <>
                  {creator.avatar ? (
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 sm:w-6 sm:h-6 text-white/80" />
                  )}
                  <span className="text-xs font-medium text-white">{creator.name}</span>
                </>
              )}
            </div>
            
            {isPremium && (
              <Badge 
                variant="secondary"
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-[10px] sm:text-xs"
              >
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}