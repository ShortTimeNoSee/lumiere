import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MasonryGrid } from "@/components/MasonryGrid";

interface CollectionViewProps {
  collectionId: string;
  onClose?: () => void;
}

export function CollectionView({ collectionId, onClose }: CollectionViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const { data } = await supabase
        .from('collections')
        .select(`
          *,
          pins:collection_items(
            pin:pins(
              *,
              creator:profiles(*)
            )
          )
        `)
        .eq('id', collectionId)
        .single();
      
      if (data) {
        setName(data.name);
        setDescription(data.description || "");
      }
      
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('collections')
        .update({ name, description })
        .eq('id', collectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
      setIsEditing(false);
      toast({
        title: "Collection updated",
        description: "Your changes have been saved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive",
      });
    },
  });

  const pins = collection?.pins?.map((item: any) => item.pin) || [];
  const isOwner = user?.id === collection?.creator_id;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <div className="space-y-4 w-full">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Collection description"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => updateMutation.mutate()}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold">{collection.name}</h2>
              {collection.description && (
                <p className="text-muted-foreground mt-1">{collection.description}</p>
              )}
            </div>
            {isOwner && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </>
        )}
      </div>

      <MasonryGrid
        pins={pins}
        onPinClick={(pin) => {
          // Handle pin click
        }}
      />
    </div>
  );
}