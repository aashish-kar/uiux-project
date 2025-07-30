import { useState, useEffect, useRef } from 'react';
import { ChevronLeftCircle, ChevronRightCircle, X, Plus, Check, Palette, Settings } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, Product } from '@/services/api';
import { cartAPI } from '@/services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CustomizationOptions {
  model: string;
  strapType: string;
  dialColor: string;
  engraving: string;
}

// Enhanced SVG Watch Preview Component
const WatchSVGPreview = ({ dialColor, strapType, engraving }) => {
  const strapColors = {
    leather: '#7c4a03',
    steel: '#b0b6be',
    silicone: '#22223b',
    nato: '#3b5f78',
  };

  return (
    <svg viewBox="0 0 300 420" width="100%" height="340" className="mx-auto block">
      <defs>
        <linearGradient id={`strap-gradient-${strapType}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strapColors[strapType]} stopOpacity="0.95" />
          <stop offset="100%" stopColor={strapColors[strapType]} stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="watch-shine" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dial-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Strap - Top with buckle */}
      <path d="M115,10 Q150,0 185,10 L175,110 Q150,120 125,110 Z" fill={`url(#strap-gradient-${strapType})`} />
      <rect x="138" y="2" width="24" height="12" rx="4" fill="#e5e7eb" stroke="#b0b6be" strokeWidth="2" />
      <rect x="148" y="2" width="4" height="12" rx="2" fill="#b0b6be" />
      
      {/* Watch Body with shine */}
      <circle cx="150" cy="210" r="85" fill="#e5e7eb" stroke="#22223b" strokeWidth="8" />
      <circle cx="150" cy="210" r="85" fill="url(#watch-shine)" />
      
      {/* Dial with shine */}
      <circle cx="150" cy="210" r="70" fill={dialColor} stroke="#b0b6be" strokeWidth="3" />
      <circle cx="150" cy="210" r="70" fill="url(#dial-shine)" />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const x1 = 150 + Math.sin(angle) * 60;
        const y1 = 210 - Math.cos(angle) * 60;
        const x2 = 150 + Math.sin(angle) * 65;
        const y2 = 210 - Math.cos(angle) * 65;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22223b" strokeWidth={i % 3 === 0 ? 4 : 2} />;
      })}
      
      {/* Hands with shadow */}
      <line x1="151" y1="211" x2="151" y2="146" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="151" y1="211" x2="211" y2="211" stroke="#000" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="150" y1="210" x2="150" y2="145" stroke="#22223b" strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="210" x2="210" y2="210" stroke="#22223b" strokeWidth="3" strokeLinecap="round" />
      
      {/* Center dot */}
      <circle cx="150" cy="210" r="3" fill="#22223b" />
      
      {/* Engraving with glow */}
      {engraving && (
        <>
          <text x="150" y="252" textAnchor="middle" fontSize="18" fill="#000" fontFamily="monospace" opacity="0.3">
            {engraving}
          </text>
          <text x="150" y="250" textAnchor="middle" fontSize="16" fill="#FFD700" fontFamily="monospace" opacity="0.9">
            {engraving}
          </text>
        </>
      )}
      
      {/* Strap - Bottom with holes */}
      <path d="M125,290 Q150,280 175,290 L185,390 Q150,410 115,390 Z" fill={`url(#strap-gradient-${strapType})`} />
      {[...Array(5)].map((_, i) => (
        <circle key={i} cx="150" cy={320 + i * 14} r="3" fill="#fff" fillOpacity="0.7" stroke="#b0b6be" strokeWidth="1" />
      ))}
    </svg>
  );
};

export default function Customization() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    model: '',
    strapType: 'leather',
    dialColor: 'black',
    engraving: ''
  });
  
  // New state for enhanced features
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');

  const strapOptions = [
    { value: 'leather', label: 'Leather', price: 0 },
    { value: 'steel', label: 'Stainless Steel', price: 5000 },
    { value: 'silicone', label: 'Silicone', price: 2000 },
    { value: 'nato', label: 'NATO', price: 1500 }
  ];

  const dialColors = [
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'white', label: 'White', color: '#FFFFFF' },
    { value: 'blue', label: 'Navy Blue', color: '#1e3a8a' },
    { value: 'green', label: 'Forest Green', color: '#166534' },
    { value: 'brown', label: 'Chocolate Brown', color: '#92400e' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
          setCustomization(prev => ({ ...prev, model: data[0]._id }));
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const handleModelChange = (productId: string) => {
    const product = products.find(p => p._id === productId);
    setSelectedProduct(product || null);
    setCustomization(prev => ({ ...prev, model: productId }));
  };

  const getTotalPrice = () => {
    if (!selectedProduct) return 0;
    const strapPrice = strapOptions.find(s => s.value === customization.strapType)?.price || 0;
    const engravingPrice = customization.engraving.trim() ? 3000 : 0;
    return selectedProduct.price + strapPrice + engravingPrice;
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) {
      toast({
        title: 'Error',
        description: 'Please select a watch model',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartAPI.addToCart({
        productId: selectedProduct._id,
        quantity: 1,
        strapType: customization.strapType,
        dialColor: customization.dialColor,
        engraving: customization.engraving.trim(),
      });
      toast({
        title: 'Success',
        description: 'Custom watch added to cart! We\'ll contact you for customization details.',
      });
      navigate('/cart');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  // Enhanced controls
  const handleExpand = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="h-64 bg-muted rounded"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {isFullScreen ? (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCloseFullScreen}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-300"
            >
              <X size={20} />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
          <div style={{ height: '100vh' }} className="flex items-center justify-center">
            <WatchSVGPreview
              dialColor={dialColors.find(c => c.value === customization.dialColor)?.color || '#000'}
              strapType={customization.strapType}
              engraving={customization.engraving}
            />
          </div>
        </div>
      ) : (
        <>
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
              <div className="relative z-10 container mx-auto px-6">
                <div className="text-center space-y-4 animate-fade-in-up">
                  <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
                    Watch <span className="text-accent">Customization</span>
                  </h1>
                  <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
                    Design your perfect timepiece with our interactive customization tool
                  </p>
                </div>
              </div>
            </section>

            <div className="container mx-auto px-6 pb-16">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Watch Preview Section */}
                <div className="space-y-6">
                  <Card className="bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20 hover:border-accent/50 transition-all duration-500 hover:shadow-luxury">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">Live Preview</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExpand}
                        className="hover:bg-accent/10 hover:text-accent transition-all duration-300"
                      >
                        <ChevronRightCircle className="w-4 h-4 mr-2" />
                        Expand
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8">
                        <WatchSVGPreview
                          dialColor={dialColors.find(c => c.value === customization.dialColor)?.color || '#000'}
                          strapType={customization.strapType}
                          engraving={customization.engraving}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customization Panel */}
                <div className="space-y-6">
                  <Card className="bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Customization Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-background/50">
                          <TabsTrigger value="customize" className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Customize
                          </TabsTrigger>
                          <TabsTrigger value="details" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Details
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="customize" className="space-y-6">
                          {/* Watch Model Selection */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">Watch Model</Label>
                            <Select value={customization.model} onValueChange={handleModelChange}>
                              <SelectTrigger className="bg-background/50 border-border/50">
                                <SelectValue placeholder="Choose a watch model" />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-sm">
                                {products.map((product) => (
                                  <SelectItem key={product._id} value={product._id} className="hover:bg-accent/10">
                                    {product.name} - Rs {product.price.toLocaleString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Strap Type */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">Strap Type</Label>
                            <RadioGroup 
                              value={customization.strapType} 
                              onValueChange={(value) => setCustomization(prev => ({ ...prev, strapType: value }))}
                            >
                              {strapOptions.map((strap) => (
                                <div key={strap.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                                  <RadioGroupItem value={strap.value} id={strap.value} className="text-accent" />
                                  <Label htmlFor={strap.value} className="flex-1 cursor-pointer">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{strap.label}</span>
                                      <Badge variant={strap.price > 0 ? "secondary" : "default"} className="ml-2">
                                        {strap.price > 0 ? `+Rs ${strap.price.toLocaleString()}` : 'Included'}
                                      </Badge>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Dial Color */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">Dial Color</Label>
                            <div className="flex flex-wrap gap-4">
                              {dialColors.map((color) => (
                                <button
                                  key={color.value}
                                  onClick={() => setCustomization(prev => ({ ...prev, dialColor: color.value }))}
                                  className={`relative p-2 rounded-lg border-2 transition-all duration-300 ${
                                    customization.dialColor === color.value 
                                      ? 'border-accent shadow-lg scale-105' 
                                      : 'border-border hover:border-accent/50'
                                  }`}
                                >
                                  <div
                                    className="w-12 h-12 rounded-full border border-border/50"
                                    style={{ backgroundColor: color.color }}
                                  />
                                  <span className="block mt-2 text-xs text-muted-foreground text-center whitespace-nowrap">
                                    {color.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Engraving */}
                          <div className="space-y-3">
                            <Label htmlFor="engraving" className="text-base font-semibold">
                              Personal Engraving
                            </Label>
                            <Input
                              id="engraving"
                              placeholder="Enter your custom message (max 20 characters)"
                              value={customization.engraving}
                              onChange={(e) => setCustomization(prev => ({ ...prev, engraving: e.target.value.slice(0, 20) }))}
                              maxLength={20}
                              className="bg-background/50 border-border/50"
                            />
                            <p className="text-sm text-muted-foreground">
                              {customization.engraving.length}/20 characters
                              {customization.engraving.trim() && (
                                <Badge variant="secondary" className="ml-2">+Rs 3,000</Badge>
                              )}
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Watch Specifications</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">Case Size:</span>
                                <p>40mm diameter</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Movement:</span>
                                <p>Automatic chronograph</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Water Resistance:</span>
                                <p>100 meters</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Material:</span>
                                <p>Stainless steel</p>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Price:</span>
                                <span className="text-2xl font-bold text-accent">Rs {getTotalPrice().toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>


                      </Tabs>
                                         </CardContent>
                   </Card>
                   
                   {/* Add to Cart Button */}
                   <Card className="bg-glass-gradient backdrop-blur-sm border border-luxury-silver/20">
                     <CardContent className="p-6">
                       <div className="flex justify-between items-center mb-4">
                         <div>
                           <h3 className="text-lg font-semibold">Total Price</h3>
                           <p className="text-2xl font-bold text-accent">Rs {getTotalPrice().toLocaleString()}</p>
                         </div>
                         <div className="text-right text-sm text-muted-foreground">
                           <p>Base Price: Rs {selectedProduct?.price.toLocaleString()}</p>
                           {strapOptions.find(s => s.value === customization.strapType)?.price > 0 && (
                             <p>Strap: +Rs {strapOptions.find(s => s.value === customization.strapType)?.price.toLocaleString()}</p>
                           )}
                           {customization.engraving.trim() && (
                             <p>Engraving: +Rs 3,000</p>
                           )}
                         </div>
                       </div>
                       <Button 
                         onClick={handleAddToCart}
                         className="w-full bg-luxury-gradient hover:bg-luxury-gradient/90 text-luxury-black font-semibold transition-all duration-300 luxury-hover py-6 text-lg"
                         disabled={!selectedProduct}
                       >
                         Add Custom Watch to Cart
                       </Button>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            theme='light'
          />
        </>
      )}
    </>
  );
} 