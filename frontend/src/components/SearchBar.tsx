import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI, Product } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Fetch all products on component mount for local search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productsAPI.getAll();
        setAllProducts(products);
      } catch (err) {
        console.error('Error fetching products for search:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      setLoading(true);
      try {
        // Try API search first
        const apiResults = await productsAPI.search(query);
        const formattedResults: SearchResult[] = apiResults.map(product => ({
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image
        }));
        setSearchResults(formattedResults);
      } catch (err) {
        // Fallback to local search if API fails
        console.error('API search failed, using local search:', err);
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
        );
        const formattedResults: SearchResult[] = filtered.map(product => ({
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image
        }));
        setSearchResults(formattedResults);
      } finally {
        setLoading(false);
        setIsSearchOpen(true);
      }
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    clearSearch();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for watches, brands, categories..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-8 w-full md:w-64 h-9 rounded-md border border-gray-300 bg-white shadow-sm focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isSearchOpen && (searchResults.length > 0 || loading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-luxury backdrop-blur-sm bg-background/95">
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-playfair font-semibold text-sm">{result.name}</h4>
                      <p className="text-xs text-muted-foreground">{result.category}</p>
                    </div>
                    <span className="font-playfair font-bold text-accent text-sm">
                      Rs {result.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isSearchOpen && searchResults.length === 0 && searchQuery && !loading && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-luxury backdrop-blur-sm bg-background/95">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">No timepieces found matching "{searchQuery}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
