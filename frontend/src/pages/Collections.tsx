import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { productsAPI, Product } from '@/services/api';

interface CollectionGroup {
  category: string;
  products: Product[];
  description: string;
  badge: string;
}

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const allProducts = await productsAPI.getAll();
        // Group products by category
        const categoryGroups = allProducts.reduce((acc, product) => {
          const existing = acc.find(group => group.category === product.category);
          if (existing) {
            existing.products.push(product);
          } else {
            acc.push({
              category: product.category,
              products: [product],
              description: getCategoryDescription(product.category),
              badge: getCategoryBadge(product.category)
            });
          }
          return acc;
        }, [] as CollectionGroup[]);
        setCollections(categoryGroups);
      } catch (err) {
        setError('Failed to load collections');
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const getCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      'Heritage': 'Timeless classics that embody Swiss tradition',
      'Sport': 'Precision instruments for the active lifestyle',
      'Luxury': 'The pinnacle of horological excellence',
      'Classic': 'Elegant designs for everyday sophistication',
      'Modern': 'Contemporary timepieces for the modern connoisseur'
    };
    return descriptions[category] || 'Exquisite timepieces for discerning collectors';
  };

  const getCategoryBadge = (category: string): string => {
    const badges: { [key: string]: string } = {
      'Heritage': 'Limited Edition',
      'Sport': 'New Arrival',
      'Luxury': 'Exclusive',
      'Classic': 'Timeless',
      'Modern': 'Contemporary'
    };
    return badges[category] || 'Featured';
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const getMinPrice = (products: Product[]): number => {
    return Math.min(...products.map(p => p.price));
  };
  const getMaxPrice = (products: Product[]): number => {
    return Math.max(...products.map(p => p.price));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center space-y-4 animate-fade-in-up">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
                Our <span className="text-accent">Collections</span>
              </h1>
              
            </div>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-luxury animate-pulse">
                  <div className="w-full h-64 bg-muted"></div>
                  <CardContent className="p-5 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded-full w-20"></div>
                      <div className="h-6 bg-muted rounded-full w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <section className="relative pt-20 pb-12 bg-luxury-gradient-subtle overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center space-y-4 animate-fade-in-up">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
                Our <span className="text-accent">Collections</span>
              </h1>
              <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-luxury-gradient"
              >
                Try Again
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
              Our <span className="text-accent">Collections</span>
            </h1>
            
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-6">
          {collections.length > 0 ? (
            <div className="space-y-12">
              {collections.map((collection, index) => {
                return (
                  <div key={collection.category} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-accent/20 pb-4">
                      <div>
                        <h2 className="font-playfair text-3xl font-bold text-foreground flex items-center gap-3 tracking-tight drop-shadow-lg">
                          {collection.category}
                          <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full shadow-md">{collection.badge}</Badge>
                        </h2>
                        <p className="text-muted-foreground mt-2 text-base">{collection.description}</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {collection.products.map((product, pidx) => (
                        <Card 
                          key={product._id} 
                          className="group overflow-hidden bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20 hover:border-accent/50 transition-all duration-500 hover:shadow-luxury animate-fade-in-up"
                          style={{ animationDelay: `${pidx * 0.2}s` }}
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
                                {product.brand}
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
                                onClick={() => handleViewDetails(product._id)}
                              >
                                Explore
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">No collections found.</div>
          )}
        </div>
      </section>

      {/* View All Collections Button */}
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mt-12 animate-fade-in">
            <Button 
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 font-inter font-semibold px-6 py-4 text-base"
              onClick={() => navigate('/collections')}
            >
              View All Collections
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collections;
