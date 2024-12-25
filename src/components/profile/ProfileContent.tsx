import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasonryGrid } from "@/components/MasonryGrid";
import { useNavigate } from "react-router-dom";

interface ProfileContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  collections: any[];
  pins: any[];
  onPinClick: (pin: any) => void;
}

export const ProfileContent = ({
  activeTab,
  setActiveTab,
  collections,
  pins,
  onPinClick
}: ProfileContentProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="uploads">Uploads</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      
      <TabsContent value="uploads" className="min-h-[200px]">
        <MasonryGrid
          pins={pins || []}
          onPinClick={onPinClick}
        />
      </TabsContent>
      
      <TabsContent value="collections" className="min-h-[200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(collections || []).map((collection) => (
            <div
              key={collection.id}
              className="relative aspect-square cursor-pointer group"
              onClick={() => navigate(`/collection/${collection.id}`)}
            >
              <div className="absolute inset-0 bg-black/50 rounded-lg overflow-hidden">
                <img 
                  src={collection.coverImage} 
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-medium truncate">{collection.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};