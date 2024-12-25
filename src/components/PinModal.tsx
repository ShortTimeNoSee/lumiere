import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  if (!pin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{pin.title}</DialogTitle>
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