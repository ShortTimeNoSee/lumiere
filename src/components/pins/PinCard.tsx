import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Flag, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PinCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes?: number;
  comments?: number;
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
  comments = 0,
  hasLiked = false,
  onClick
}: PinCardProps) {
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const { toast } = useToast();
  const { user } = useAuth();

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

  return (
    <Card 
      className="group relative w-full cursor-pointer overflow-hidden transition-transform duration-200 hover:z-10 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 mb-2">
            {creator?.avatar ? (
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
            <span className="text-sm font-medium text-white">{creator?.name || 'Unknown'}</span>
          </div>

          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-white/90 line-clamp-2 mb-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white hover:bg-white/20"
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Report submitted",
                  description: "Thank you for helping keep our community safe",
                });
              }}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}