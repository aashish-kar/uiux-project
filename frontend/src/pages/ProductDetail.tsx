import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Shield, 
  Award, 
  Clock, 
  Star, 
  Truck, 
  RotateCcw, 
  Eye,
  ShoppingCart,
  Zap,
  CheckCircle,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { productsAPI, Product, cartAPI, ordersAPI, wishlistAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistMsg, setWishlistMsg] = useState<string | null>(null);
  const [cartMsg, setCartMsg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view product details.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
  }, [isAuthenticated, navigate, id, toast]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id!);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (id && isAuthenticated) fetchProduct();
  }, [id, isAuthenticated]);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlist = await wishlistAPI.getWishlist();
        setInWishlist(wishlist.some((item: any) => item.product?._id === product?._id || item._id === product?._id));
      } catch {}
    };
    if (product) checkWishlist();
  }, [product]);

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8"></div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="w-full h-96 bg-muted rounded-lg"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-24 bg-muted rounded-lg"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                  <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-32 mb-6"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                  <div className="h-12 bg-muted rounded w-full mb-4"></div>
                  <div className="h-12 bg-muted rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">{error || 'Product not found'}</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/collections')} className="bg-luxury-gradient">
            Browse Collections
          </Button>
        </div>
      </div>
    );
  }

  // Create image gallery from actual product images
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]; // Fallback to single image if no images array

  // Process colors and sizes to handle different data formats
  const processColors = (colors: any): string[] => {
    if (Array.isArray(colors)) {
      return colors;
    }
    if (typeof colors === 'string') {
      // If it's a comma-separated string, split it
      return colors.split(',').map(c => c.trim()).filter(c => c.length > 0);
    }
    return [];
  };

  const processSizes = (sizes: any): string[] => {
    if (Array.isArray(sizes)) {
      return sizes;
    }
    if (typeof sizes === 'string') {
      // If it's a comma-separated string, split it
      return sizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  };

  const processedColors = processColors(product.colors);
  const processedSizes = processSizes(product.sizes);

  const handleWishlist = async () => {
    setWishlistLoading(true);
    setWishlistMsg(null);
    try {
      if (inWishlist) {
        const wishlist = await wishlistAPI.getWishlist();
        const item = wishlist.find((item: any) => item.product?._id === product?._id || item._id === product?._id);
        if (item) {
          await wishlistAPI.removeFromWishlist(item._id);
          setInWishlist(false);
          setWishlistMsg('Removed from wishlist');
          toast({ title: 'Removed from wishlist', description: `${product.name} has been removed from your wishlist.` });
        }
      } else {
        await wishlistAPI.addToWishlist(product._id);
        setInWishlist(true);
        setWishlistMsg('Added to wishlist');
        toast({ title: 'Added to wishlist', description: `${product.name} has been added to your wishlist.` });
      }
    } catch {
      setWishlistMsg('Error updating wishlist');
      toast({ title: 'Error', description: 'Failed to update wishlist', variant: 'destructive' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const validateCart = () => {
    if (!product.inStock) {
      toast({ title: 'Out of Stock', description: 'This product is currently out of stock.', variant: 'destructive' });
      return false;
    }
    if (quantity < 1) {
      toast({ title: 'Invalid Quantity', description: 'Please select a valid quantity.', variant: 'destructive' });
      return false;
    }
    if (product.colors?.length && !selectedColor) {
      toast({ title: 'Select Color', description: 'Please select a color.', variant: 'destructive' });
      return false;
    }
    if (product.sizes?.length && !selectedSize) {
      toast({ title: 'Select Size', description: 'Please select a size.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    setCartMsg(null);
    if (!validateCart()) {
      setCartLoading(false);
      return;
    }
    try {
      await cartAPI.addToCart({
        productId: product._id,
        quantity,
        selectedColor,
        selectedSize
      });
      setCartMsg('Added to cart!');
      toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
    } catch {
      setCartMsg('Failed to add to cart');
      toast({ title: 'Error', description: 'Failed to add to cart', variant: 'destructive' });
    } finally {
      setCartLoading(false);
    }
  };

  const handleGoToCheckout = async () => {
    if (!validateCart()) return;
    try {
      await cartAPI.addToCart({
        productId: product._id,
        quantity,
        selectedColor,
        selectedSize
      });
      toast({ title: 'Added to cart', description: `${product.name} has been added. Proceeding to checkout...` });
      navigate('/cart');
    } catch {
      toast({ title: 'Error', description: 'Failed to add to cart', variant: 'destructive' });
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing ${product.name} from watchShop!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied', description: 'Product link has been copied to clipboard.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
      <Navigation />
      
      {/* Enhanced Product Detail Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Enhanced Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/collections')}
            className="mb-6 text-muted-foreground hover:text-foreground group transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Collections
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enhanced Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
                <img 
                  src={images[selectedImage]?.trim()} 
                  alt={product.name}
                  className="w-full h-[450px] object-cover transition-all duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={inWishlist ? 'default' : 'secondary'} 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg" 
                    onClick={handleWishlist} 
                    disabled={wishlistLoading}
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? 'text-red-500 fill-current' : ''} transition-all duration-300`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={product.inStock ? 'default' : 'destructive'}
                    className="bg-white/90 backdrop-blur-sm text-foreground shadow-lg"
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              
              {/* Enhanced Gallery Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-accent shadow-lg scale-105' 
                        : 'border-transparent hover:border-accent/50'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img?.trim()} 
                    alt={`${product.name} view ${index + 1}`}
                      className="w-full h-24 object-cover transition-all duration-300 hover:scale-110"
                  />
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="border-green-500/30 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Authentic
                  </Badge>
                </div>
                
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{product.brand}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                <span className="font-playfair text-3xl font-bold text-accent">
                    Rs {product.price.toLocaleString()}
                </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Free shipping • 30-day returns • Secure payment
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  {product.inStock ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>

              {/* Product Options */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Color Selection */}
                {processedColors.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Color</label>
                    <div className="flex flex-wrap gap-3">
                      {processedColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                            selectedColor === color
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-gray-200 hover:border-accent/50'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {processedSizes.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Size</label>
                    <div className="flex flex-wrap gap-3">
                      {processedSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                            selectedSize === size
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-gray-200 hover:border-accent/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300 h-12 text-base font-semibold" 
                  onClick={handleAddToCart}
                  disabled={cartLoading || !product.inStock}
                >
                  {cartLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </div>
                  )}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 h-12 text-base font-semibold" 
                  onClick={handleGoToCheckout}
                  disabled={!product.inStock}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              {/* Enhanced Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
                <div className="text-center space-y-2 group">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-xs font-medium text-foreground">2 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </div>
                <div className="text-center space-y-2 group">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                    <Truck className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-xs font-medium text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Worldwide</p>
                </div>
                <div className="text-center space-y-2 group">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                    <RotateCcw className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-xs font-medium text-foreground">30 Day Returns</p>
                  <p className="text-xs text-muted-foreground">No questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Product Details Tabs */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="description" className="w-full">
                         <TabsList className="grid w-full grid-cols-3 bg-background/70 backdrop-blur-md border border-border/30 shadow-glass h-14 p-1">
              <TabsTrigger value="description" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground">
                Specifications
              </TabsTrigger>
              
              <TabsTrigger value="shipping" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground">
                Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
            <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">About This Timepiece</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Features</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Swiss-made precision movement</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Water-resistant design</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Premium materials</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Care Instructions</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Clean with a soft cloth</li>
                        <li>• Avoid extreme temperatures</li>
                        <li>• Regular professional servicing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Movement</h4>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Type: Automatic</p>
                        <p>Power Reserve: 48 hours</p>
                        <p>Frequency: 28,800 vph</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Case</h4>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Material: Stainless Steel</p>
                        <p>Diameter: 42mm</p>
                        <p>Water Resistance: 100m</p>
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
            </TabsContent>

            

            <TabsContent value="shipping" className="mt-6">
              <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">Shipping & Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-accent" />
                        <span>Shipping Information</span>
                      </h4>
                      <div className="space-y-2 text-muted-foreground">
                        <p>• Free worldwide shipping</p>
                        <p>• 2-5 business days delivery</p>
                        <p>• Secure packaging</p>
                        <p>• Tracking number provided</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center space-x-2">
                        <RotateCcw className="h-5 w-5 text-accent" />
                        <span>Return Policy</span>
                      </h4>
                      <div className="space-y-2 text-muted-foreground">
                        <p>• 30-day return window</p>
                        <p>• Free return shipping</p>
                        <p>• Full refund guarantee</p>
                        <p>• No questions asked</p>
                      </div>
                    </div>
          </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
