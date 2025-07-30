import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI, Product } from '@/services/api';

const FeaturedCollections = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await productsAPI.getFeatured();
        setFeaturedProducts(products);
        // Debug log for image URLs
        products.forEach(p => console.log('FeaturedCollections image:', p.image));
      } catch (err) {
        setError('Failed to load featured collections');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleExplore = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Featured Collections
            </h2>
            <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most coveted timepieces, each representing the pinnacle of Swiss horological artistry
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20">
                <div className="animate-pulse">
                  <div className="w-full h-64 bg-muted"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded-full w-20"></div>
                      <div className="h-6 bg-muted rounded-full w-24"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Featured Collections
            </h2>
            <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most coveted timepieces, each representing the pinnacle of Swiss horological artistry
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-luxury-gradient"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
            Featured Collections
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most coveted timepieces, each representing the pinnacle of Swiss horological artistry
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <Card 
              key={product._id} 
              className="group overflow-hidden bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20 hover:border-accent/50 transition-all duration-500 hover:shadow-luxury animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image?.trim()} 
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-luxury-white/10 backdrop-blur-sm border-luxury-white/30 text-luxury-white hover:bg-luxury-white hover:text-luxury-black"
                    onClick={() => handleViewDetails(product._id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="font-inter text-muted-foreground text-sm">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary/50 text-xs font-inter font-medium text-secondary-foreground rounded-full">
                    {product.brand}
                  </span>
                  <span className="px-3 py-1 bg-secondary/50 text-xs font-inter font-medium text-secondary-foreground rounded-full">
                    {product.category}
                  </span>
                  {product.inStock && (
                    <span className="px-3 py-1 bg-green-500/20 text-xs font-inter font-medium text-green-600 rounded-full">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <span className="font-playfair text-lg font-bold text-accent">
                    Rs {product.price.toLocaleString()}
                  </span>
                  <Button 
                    size="sm"
                    className="bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300"
                    onClick={() => handleExplore(product._id)}
                  >
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <Button 
            size="lg"
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 font-inter font-semibold px-8 py-6 text-lg"
            onClick={() => navigate('/collections')}
          >
            View All Collections
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
