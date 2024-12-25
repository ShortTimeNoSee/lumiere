import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { MasonryGrid } from "@/components/MasonryGrid";
import { PinModal } from "@/components/PinModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedPin, setSelectedPin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    bio: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id || user?.id)
        .single();
      return data;
    },
  });

  const { data: collections } = useQuery({
    queryKey: ['collections', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('collections')
        .select(`
          *,
          pins:collection_items(
            pin:pins(*)
          )
        `)
        .eq('creator_id', id || user?.id);

      // Transform the data to include cover image and title
      return (data || []).map(collection => ({
        ...collection,
        coverImage: collection.pins[0]?.pin?.image_url || '/placeholder.svg',
        title: collection.name // Use collection name as title
      }));
    },
  });

  const { data: pins } = useQuery({
    queryKey: ['pins', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('pins')
        .select('*')
        .eq('creator_id', id || user?.id);
      return data || [];
    },
  });

  const { data: isFollowing } = useQuery({
    queryKey: ['following', id],
    queryFn: async () => {
      if (!user || !id) return false;
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!id && id !== user.id,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user?.id)
          .eq('following_id', id);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user?.id,
            following_id: id,
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', id] });
    },
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src={profile?.avatar || '/placeholder.svg'} 
                alt={profile?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
            <p className="text-muted-foreground mb-4">@{profile?.username}</p>
            <p className="text-center max-w-md mb-6">{profile?.bio}</p>
            
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                onClick={() => window.location.href = '/upgrade'}
              >
                Upgrade to Pro
              </Button>
            </div>
            
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="uploads">Uploads</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="uploads" className="min-h-[200px]">
              <MasonryGrid
                pins={pins || []}
                onPinClick={setSelectedPin}
              />
            </TabsContent>
            
            <TabsContent value="collections" className="min-h-[200px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(collections || []).map((collection) => (
                  <div
                    key={collection.id}
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => navigate(`/collection/${collection.id}`)}
                  >
                    <div className="absolute inset-0 bg-black/50 rounded-lg overflow-hidden">
                      <img 
                        src={collection.coverImage} 
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-medium truncate">{collection.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
        onProfileClick={(userId) => navigate(`/profile/${userId}`)}
      />
    </div>
  );
};

export default Profile;
