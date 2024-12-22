import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <h1 
          className="text-2xl font-bold cursor-pointer gradient-text shrink-0"
          onClick={() => navigate("/")}
        >
          Lumiere
        </h1>

        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-4 shrink-0">
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