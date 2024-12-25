import { useState } from "react";
import { Header } from "@/components/Header";
import { PinModal } from "@/components/PinModal";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";

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

  const { data: profile, isError } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id || user?.id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) {
        throw new Error('Profile not found');
      }
      return data;
    },
    meta: {
      errorMessage: "Failed to load profile"
    }
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

      return (data || []).map(collection => ({
        ...collection,
        coverImage: collection.pins[0]?.pin?.image_url || '/placeholder.svg',
        title: collection.name
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

  if (isError) {
    toast({
      title: "Error",
      description: "Profile not found",
      variant: "destructive"
    });
    navigate('/');
    return null;
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader 
            profile={profile}
            isOwnProfile={user?.id === profile?.id}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editForm={editForm}
            setEditForm={setEditForm}
          />
          
          <ProfileContent 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collections={collections}
            pins={pins}
            onPinClick={setSelectedPin}
          />
        </div>
      </main>
      
      <PinModal
        isOpen={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        pin={selectedPin}
      />
    </div>
  );
};

export default Profile;