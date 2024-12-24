import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Heart, MessageCircle, Flag, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: {
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
    comments?: any[];
    hasLiked?: boolean;
  } | null;
}

export function PinModal({ isOpen, onClose, pin }: PinModalProps) {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(pin?.hasLiked || false);
  const [likeCount, setLikeCount] = useState(pin?.likes || 0);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!pin) return null;

  const handleLike = async () => {
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
          .match({ user_id: user.id, pin_id: pin.id });
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, pin_id: pin.id });
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

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      await supabase
        .from('comments')
        .insert({
          pin_id: pin.id,
          user_id: user.id,
          content: comment.trim()
        });

      setComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {pin.creator.avatar ? (
              <img
                src={pin.creator.avatar}
                alt={pin.creator.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-8 h-8" />
            )}
            <span>{pin.creator.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{pin.title}</h2>
              {pin.description && (
                <p className="text-muted-foreground">{pin.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="flex items-center gap-1"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                <span>{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{pin.comments?.length || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Report submitted",
                    description: "Thank you for helping keep our community safe",
                  });
                }}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Comments</h3>
              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1"
                />
                <Button onClick={handleComment}>Post</Button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {pin.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}