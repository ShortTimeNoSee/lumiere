import { Button } from "@/components/ui/button";
import { Heart, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PinCardActionsProps {
  pinId: string;
  initialLikes: number;
  hasLiked: boolean;
}

export function PinCardActions({ pinId, initialLikes, hasLiked }: PinCardActionsProps) {
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
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
          .match({ user_id: user.id, pin_id: pinId });
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, pin_id: pinId });
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
          content_id: pinId,
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

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 text-white hover:bg-white/20"
        onClick={handleReport}
      >
        <Flag className="h-4 w-4" />
      </Button>
    </div>
  );
}