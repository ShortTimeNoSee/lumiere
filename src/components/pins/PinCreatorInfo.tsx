import { User } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

interface PinCreatorInfoProps {
  creator?: Creator;
}

export function PinCreatorInfo({ creator }: PinCreatorInfoProps) {
  if (!creator) return null;

  return (
    <div className="flex items-center gap-2">
      {creator.avatar ? (
        <img 
          src={creator.avatar} 
          alt={creator.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <User className="w-8 h-8 text-white/80" />
      )}
      <span className="text-sm font-medium text-white">{creator.name}</span>
    </div>
  );
}