import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const searchCategories = ['Images', 'Collections', 'People', 'Trending'] as const;
type SearchCategory = typeof searchCategories[number];

export function SearchBar() {
  const [category, setCategory] = useState<SearchCategory>('Images');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const searchParams = new URLSearchParams({
      q: query,
      category: category.toLowerCase(),
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder={`Search ${category.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {searchCategories.map((cat) => (
            <DropdownMenuItem
              key={cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}