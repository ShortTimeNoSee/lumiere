import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropper } from '@/components/profile/ImageCropper';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && profile) {
      navigate('/');
    } else if (user && !profile) {
      setIsSettingUpProfile(true);
    }
  }, [user, profile, navigate]);

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

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let avatarUrl = null;
      
      if (avatarFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-content')
          .upload(`avatars/${user!.id}`, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-content')
          .getPublicUrl(`avatars/${user!.id}`);
          
        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user!.id,
          username,
          name: displayName,
          email: user!.email!,
          avatar: avatarUrl,
        });

      if (error) throw error;

      toast({
        title: "Profile created",
        description: "Welcome to Lumiere!",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isSettingUpProfile) {
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
          
          <form onSubmit={handleProfileSetup} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {avatarFile ? (
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">👤</span>
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

            <Button type="submit" className="w-full">
              Complete Setup
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            Welcome to Lumiere
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg border">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(147, 51, 234)',
                    brandAccent: 'rgb(126, 34, 206)',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_up: {
                  password_label: 'Password (minimum 8 characters, including uppercase, lowercase, and numbers)',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}