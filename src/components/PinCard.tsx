import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Flag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PinCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  isAd?: boolean;
  advertiser?: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  width?: number;
  height?: number;
  isPremium?: boolean;
  likes?: number;
  hasLiked?: boolean;
  onClick: () => void;
}

export function PinCard({
  id,
  imageUrl,
  title,
  description,
  isAd,
  advertiser,
  creator,
  width,
  height,
  isPremium,
  likes = 0,
  hasLiked = false,
  onClick
}: PinCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const { toast } = useToast();
  const { user } = useAuth();
  const aspectRatio = height && width ? height / width : 1;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like pins",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, pin_id: id });
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, pin_id: id });
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to report content",
      });
      return;
    }

    try {
      await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          content_type: 'pin',
          content_id: id,
          reason: 'inappropriate',
        });
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
    }
  };

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
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                onClick={handleLike}
              >
                <span className="sr-only">Like</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="ml-1 text-xs">{likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                onClick={handleReport}
              >
                <Flag className="h-4 w-4" />
                <span className="sr-only">Report</span>
              </Button>
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