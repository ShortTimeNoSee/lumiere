import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Lumiere
        </h1>
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost"
            onClick={() => navigate("/create")}
          >
            Create Pin
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/profile")}
          >
            Profile
          </Button>
        </nav>
      </div>
    </header>
  );
}