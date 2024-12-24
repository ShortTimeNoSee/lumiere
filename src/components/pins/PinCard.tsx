import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PinCardActions } from "./PinCardActions";
import { PinCreatorInfo } from "./PinCreatorInfo";

interface PinCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes?: number;
  hasLiked?: boolean;
  onClick: () => void;
}

export function PinCard({
  id,
  imageUrl,
  title,
  description,
  creator,
  likes = 0,
  hasLiked = false,
  onClick
}: PinCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card 
      className="overflow-hidden cursor-pointer group relative w-full transform-gpu transition-transform duration-200 hover:z-10 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className={`w-full h-auto object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <PinCreatorInfo creator={creator} />

          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-white/90 line-clamp-2 mb-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <PinCardActions
              pinId={id}
              initialLikes={likes}
              hasLiked={hasLiked}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}