import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  pinId: string;
}

export function CollectionSelector({ isOpen, onClose, pinId }: CollectionSelectorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [visibility, setVisibility] = useState("public");

  const { data: collections = [] } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('creator_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const createCollectionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          name: newCollectionName,
          creator_id: user.id,
          visibility
        })
        .select()
        .single();

      if (collectionError) throw collectionError;

      const { error: itemError } = await supabase
        .from('collection_items')
        .insert({
          collection_id: collection.id,
          pin_id: pinId
        });

      if (itemError) throw itemError;

      return collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setNewCollectionName("");
      setShowNewCollection(false);
      toast({
        title: "Success",
        description: "Pin added to new collection",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive"
      });
    }
  });

  const addToCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const { error } = await supabase
        .from('collection_items')
        .insert({
          collection_id: collectionId,
          pin_id: pinId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pin added to collection",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add pin to collection",
        variant: "destructive"
      });
    }
  });

  const handleAddToCollection = (collectionId: string) => {
    addToCollectionMutation.mutate(collectionId);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Collection name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    createCollectionMutation.mutate();
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
          </DialogHeader>
          <p>Please sign in to save pins to collections.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to collection</DialogTitle>
        </DialogHeader>

        {showNewCollection ? (
          <form onSubmit={handleCreateCollection} className="space-y-4">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewCollection(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowNewCollection(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create new collection
            </Button>

            <div className="space-y-2">
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleAddToCollection(collection.id)}
                >
                  {collection.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}