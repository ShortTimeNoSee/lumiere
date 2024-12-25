import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}