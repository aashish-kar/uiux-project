import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cartAPI, CartItem } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Failed to load cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (itemId: string, quantity: number) => {
    setUpdating(true);
    try {
      await cartAPI.updateCartItem(itemId, { quantity });
      toast({
        title: 'Success',
        description: 'Cart updated!',
      });
      fetchCart();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Failed to update cart',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(true);
    try {
      await cartAPI.removeFromCart(itemId);
      toast({
        title: 'Success',
        description: 'Item removed!',
      });
      fetchCart();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Failed to remove item',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClear = async () => {
    setUpdating(true);
    try {
      await cartAPI.clearCart();
      toast({
        title: 'Success',
        description: 'Cart cleared!',
      });
      fetchCart();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Failed to clear cart',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + ((item.customPrice ?? (item.product && item.product.price)) * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
              My <span className="text-accent">Cart</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              Review your selected items and proceed to checkout.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <Card className="flex-1 border-0 shadow-luxury bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center justify-between">
                  Cart Items
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading cart...</p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-8 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6h13" /></svg>
                    <p className="text-muted-foreground text-base">Your cart is empty</p>
                    <Button className="mt-4 bg-luxury-gradient px-6 py-2 text-sm" onClick={() => navigate('/collections')}>Shop Now</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cart.map((item, idx) => (
                      !item.product ? null : (
                        <div key={item._id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/90 rounded-lg group transition-all duration-300 hover:shadow-xl hover:border-accent border border-transparent relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 group-hover:border-accent shadow-sm group-hover:shadow-lg transition-all duration-300"
                          />
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                              <div>
                                <h4 className="font-playfair font-semibold text-base mb-1">{item.product.name}</h4>
                                <p className="text-xs text-muted-foreground mb-1">{item.product.brand}</p>
                                <Badge variant="secondary">{item.product.category}</Badge>
                                {item.strapType && <div className="text-xs mt-1">Strap: <span className="font-semibold">{item.strapType}</span></div>}
                                {item.dialColor && <div className="text-xs">Dial: <span className="font-semibold">{item.dialColor}</span></div>}
                                {item.engraving && <div className="text-xs">Engraving: <span className="font-semibold">{item.engraving}</span></div>}
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <span className="text-sm">Qty:</span>
                                <button
                                  className="px-2 py-1 rounded bg-muted text-lg font-bold border hover:bg-accent/20"
                                  onClick={() => handleUpdate(item._id, Math.max(1, item.quantity - 1))}
                                  disabled={updating || item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >-</button>
                                <input
                                  type="number"
                                  min={1}
                                  max={item.product.stock}
                                  value={item.quantity}
                                  onChange={e => handleUpdate(item._id, Number(e.target.value))}
                                  className="w-14 border rounded px-2 py-1 text-center"
                                  disabled={updating}
                                  aria-label="Quantity"
                                />
                                <button
                                  className="px-2 py-1 rounded bg-muted text-lg font-bold border hover:bg-accent/20"
                                  onClick={() => handleUpdate(item._id, Math.min(item.product.stock, item.quantity + 1))}
                                  disabled={updating || item.quantity >= item.product.stock}
                                  aria-label="Increase quantity"
                                >+</button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <span className="font-playfair font-bold text-accent text-base">
                              Rs {(item.customPrice ?? item.product.price).toLocaleString()} x {item.quantity}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => handleRemove(item._id)} disabled={updating}>
                              Remove
                            </Button>
                          </div>
                          {/* Divider for all but last item */}
                          {idx !== cart.length - 1 && <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200" />}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Cart Summary */}
            <Card className="w-full max-w-sm border border-accent/20 shadow-2xl bg-white/70 backdrop-blur-lg self-start sticky top-32">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">Rs {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-accent">Rs {total.toLocaleString()}</span>
                </div>
                <Button className="w-full bg-luxury-gradient mb-2" onClick={() => navigate('/checkout')} disabled={cart.length === 0 || updating}>
                  Proceed to Checkout
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleClear} disabled={cart.length === 0 || updating}>
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart; 