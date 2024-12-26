import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Heart, MessageCircle, Flag, Share2, User, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { CollectionSelector } from "@/components/collections/CollectionSelector";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: (userId: string) => void;
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

export function PinModal({ isOpen, onClose, pin, onProfileClick }: PinModalProps) {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(pin?.hasLiked || false);
  const [likeCount, setLikeCount] = useState(pin?.likes || 0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Pin URL has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-black flex items-center justify-center">
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer" 
                  onClick={() => onProfileClick(pin.creator.id)}
                >
                  <Avatar className="h-10 w-10">
                    {pin.creator.avatar ? (
                      <AvatarImage src={pin.creator.avatar} alt={pin.creator.name} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{pin.creator.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className="flex items-center gap-1"
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{likeCount}</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Liked by</h4>
                        {/* Add likers list here */}
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCollectionSelector(true)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <Flag className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">{pin.title}</h2>
                {pin.description && (
                  <p className="text-muted-foreground">{pin.description}</p>
                )}
              </div>

              <div className="space-y-4">
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

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {pin.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                      <Avatar className="h-8 w-8">
                        {comment.user.avatar ? (
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 
                            className="text-sm font-medium cursor-pointer hover:underline"
                            onClick={() => onProfileClick(comment.user.id)}
                          >
                            {comment.user.name}
                          </h4>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="ghost" size="sm">Reply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        contentType="pin"
        contentId={pin.id}
      />

      <CollectionSelector
        isOpen={showCollectionSelector}
        onClose={() => setShowCollectionSelector(false)}
        pinId={pin.id}
      />
    </>
  );
}