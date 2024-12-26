import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ImageCropper } from "@/components/profile/ImageCropper";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async (croppedImage: Blob) => {
    setAvatarFile(new File([croppedImage], 'avatar.jpg', { type: 'image/jpeg' }));
    setCroppingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      let avatarUrl = null;
      
      if (avatarFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-content')
          .upload(`avatars/${user.id}`, avatarFile, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-content')
          .getPublicUrl(`avatars/${user.id}`);
          
        avatarUrl = publicUrl;
      }

      await updateProfile({
        username,
        name: displayName,
        email: user.email,
        avatar: avatarUrl,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile setup",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Set up your profile to get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {avatarFile ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                pattern="^[a-zA-Z0-9_]{3,20}$"
                title="3-20 characters, letters, numbers and underscores only"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <Input
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </div>

      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onCrop={handleCrop}
          onClose={() => setCroppingImage(null)}
          aspectRatio={1}
        />
      )}
    </div>
  );
}