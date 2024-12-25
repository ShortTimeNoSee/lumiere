import { useNavigate } from "react-router-dom";

interface Collection {
  id: string;
  name: string;
  coverImage?: string;
  pinCount?: number;
}

interface CollectionGridProps {
  collections: Collection[];
  onCollectionClick?: (collection: Collection) => void;
}

export function CollectionGrid({ collections, onCollectionClick }: CollectionGridProps) {
  const navigate = useNavigate();

  const handleClick = (collection: Collection) => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    } else {
      navigate(`/collection/${collection.id}`);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="relative aspect-square cursor-pointer group"
          onClick={() => handleClick(collection)}
        >
          <div className="absolute inset-0 bg-black/50 rounded-lg overflow-hidden">
            {collection.coverImage && (
              <img
                src={collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium truncate">{collection.name}</h3>
            {collection.pinCount !== undefined && (
              <p className="text-white/80 text-sm">{collection.pinCount} pins</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}