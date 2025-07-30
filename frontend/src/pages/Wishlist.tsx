import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { wishlistAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartLoading, setCartLoading] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistAPI.getWishlist();
      setWishlist(data);
    } catch (err) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (itemId: string) => {
    setUpdating(true);
    setSuccess(null);
    try {
      await wishlistAPI.removeFromWishlist(itemId);
      setSuccess('Item removed!');
      fetchWishlist();
    } catch (err) {
      setError('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClear = async () => {
    setUpdating(true);
    setSuccess(null);
    try {
      await wishlistAPI.clearWishlist();
      setSuccess('Wishlist cleared!');
      fetchWishlist();
    } catch (err) {
      setError('Failed to clear wishlist');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddToCart = async (item: any) => {
    setCartLoading(item.product?._id || item._id);
    try {
      await cartAPI.addToCart({ productId: item.product?._id || item._id, quantity: 1 });
      toast({ title: 'Added to cart', description: `${item.product?.name || item.name} added to cart.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || 'Failed to add to cart', variant: 'destructive' });
    } finally {
      setCartLoading(null);
    }
  };

  const handleBuyNow = async (item: any) => {
    setCartLoading(item.product?._id || item._id);
    try {
      await cartAPI.addToCart({ productId: item.product?._id || item._id, quantity: 1 });
      navigate('/cart');
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || 'Failed to add to cart', variant: 'destructive' });
    } finally {
      setCartLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
              My <span className="text-accent">Wishlist</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              View and manage your favorite products.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <Card className="border-0 shadow-luxury">
            <CardHeader>
              <CardTitle className="font-playfair text-xl">Wishlist Items</CardTitle>
              {success && <div className="text-green-600 mt-2">{success}</div>}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading wishlist...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                  <Button className="mt-4 bg-luxury-gradient" onClick={() => navigate('/collections')}>Browse Products</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((item: any) => (
                    <div key={item._id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/30">
                      <img
                        src={item.product?.image || item.image}
                        alt={item.product?.name || item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-playfair font-semibold">{item.product?.name || item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.product?.brand || item.brand}</p>
                        <Badge variant="secondary">{item.product?.category || item.category}</Badge>
                      </div>
                      <span className="font-playfair font-bold text-accent">
                        Rs {item.product?.price?.toLocaleString() || item.price?.toLocaleString()}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleRemove(item._id)} disabled={updating}>
                        Remove
                      </Button>
                      <Button variant="default" size="sm" className="ml-2" onClick={() => handleAddToCart(item)} disabled={cartLoading === (item.product?._id || item._id)}>
                        {cartLoading === (item.product?._id || item._id) ? 'Adding...' : 'Add to Cart'}
                      </Button>
                      <Button variant="secondary" size="sm" className="ml-2" onClick={() => handleBuyNow(item)} disabled={cartLoading === (item.product?._id || item._id)}>
                        {cartLoading === (item.product?._id || item._id) ? 'Processing...' : 'Buy Now'}
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4">
                    <Button variant="destructive" onClick={handleClear} disabled={updating}>
                      Clear Wishlist
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Wishlist; 