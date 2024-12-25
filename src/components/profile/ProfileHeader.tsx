import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editForm: {
    name: string;
    username: string;
    bio: string;
  };
  setEditForm: (value: any) => void;
}

export const ProfileHeader = ({ 
  profile, 
  isOwnProfile, 
  isEditing, 
  setIsEditing, 
  editForm, 
  setEditForm 
}: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  return (
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
      
      {isOwnProfile && (
        <>
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
            onClick={() => navigate('/upgrade')}
          >
            Upgrade to Pro
          </Button>
        </>
      )}
    </div>
  );
};