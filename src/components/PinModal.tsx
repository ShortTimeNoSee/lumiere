import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: {
    imageUrl: string;
    title: string;
    description?: string;
    creator?: {
      id: string;
      name: string;
      avatar?: string;
    };
  } | null;
}

export function PinModal({ isOpen, onClose, pin }: PinModalProps) {
  const navigate = useNavigate();
  
  if (!pin) return null;

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {pin.creator && (
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => pin.creator?.id && handleProfileClick(pin.creator.id)}
              >
                {pin.creator.avatar && (
                  <img
                    src={pin.creator.avatar}
                    alt={pin.creator.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{pin.creator.name}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full rounded-lg"
          />
          {pin.description && (
            <p className="mt-4 text-muted-foreground">{pin.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}