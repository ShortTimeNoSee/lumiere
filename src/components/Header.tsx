import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 w-full bg-background/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <h1 
          className="text-2xl font-bold cursor-pointer gradient-text shrink-0"
          onClick={() => navigate("/")}
        >
          Lumiere
        </h1>

        <div className="hidden md:flex flex-1 max-w-2xl">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
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
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
            <div className="flex flex-col gap-4 py-4">
              <SearchBar />
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate("/create");
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                Create
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                Profile
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                onClick={() => {
                  navigate("/upgrade");
                  setIsOpen(false);
                }}
              >
                Upgrade
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}