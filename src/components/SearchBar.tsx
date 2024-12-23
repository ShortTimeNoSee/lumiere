import { useState, useCallback } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

interface AdvancedSearchParams {
  exactMatch?: string;
  excludeTerms?: string;
  author?: string;
  excludeAuthors?: string[];
  fileType?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export function SearchBar() {
  const [category, setCategory] = useState<string>('images');
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<AdvancedSearchParams>({});
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category: category.toLowerCase(),
        ...(advancedParams.exactMatch && { exact: advancedParams.exactMatch }),
        ...(advancedParams.excludeTerms && { exclude: advancedParams.excludeTerms }),
        ...(advancedParams.author && { author: advancedParams.author }),
        ...(advancedParams.fileType && { type: advancedParams.fileType }),
      });
      
      navigate(`/search?${searchParams.toString()}`);
    },
    [category, advancedParams, navigate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col w-full max-w-2xl gap-2">
      <div className="flex items-center gap-2">
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setCategory('Images')}>
              Images
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory('Collections')}>
              Collections
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory('People')}>
              People
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory('Trending')}>
              Trending
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAdvanced(!showAdvanced)}>
              Advanced Search <ChevronDown className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showAdvanced && (
        <div className="mt-2 p-4 bg-background border rounded-md shadow-sm space-y-3 animate-in fade-in-0 slide-in-from-top-2">
          <Input
            placeholder="Exact match phrase"
            value={advancedParams.exactMatch || ''}
            onChange={(e) => setAdvancedParams({ ...advancedParams, exactMatch: e.target.value })}
          />
          <Input
            placeholder="Exclude terms (comma separated)"
            value={advancedParams.excludeTerms || ''}
            onChange={(e) => setAdvancedParams({ ...advancedParams, excludeTerms: e.target.value })}
          />
          <Input
            placeholder="Author username"
            value={advancedParams.author || ''}
            onChange={(e) => setAdvancedParams({ ...advancedParams, author: e.target.value })}
          />
          <Input
            placeholder="File type (e.g., jpg, png)"
            value={advancedParams.fileType || ''}
            onChange={(e) => setAdvancedParams({ ...advancedParams, fileType: e.target.value })}
          />
        </div>
      )}
    </form>
  );
}