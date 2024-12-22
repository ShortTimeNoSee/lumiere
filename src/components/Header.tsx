import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 
          className="text-2xl font-bold cursor-pointer gradient-text"
          onClick={() => navigate("/")}
        >
          Lumiere
        </h1>

        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for inspiration..."
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost"
            onClick={() => navigate("/create")}
            className="hover:bg-secondary/80"
          >
            Create
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="hover:bg-secondary/80"
          >
            Profile
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
            onClick={() => navigate("/upgrade")}
          >
            Upgrade
          </Button>
        </nav>
      </div>
    </header>
  );
}