import { useState, useEffect } from 'react';
import { Plus, Home } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cartAPI, addressesAPI, ordersAPI, paymentAPI, CartItem, Address } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ cart, addresses, selectedAddress, setSelectedAddress, total, loading, placingOrder, setPlacingOrder, setError, setSuccess, navigate }: any) => {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const createIntent = async () => {
      if (total > 0) {
        try {
          const intent = await paymentAPI.createPaymentIntent({ amount: Math.round(total * 100), currency: 'usd' });
          setClientSecret(intent.clientSecret);
        } catch (err: any) {
          toast({
            title: 'Error',
            description: err?.response?.data?.error || 'Failed to initialize payment',
            variant: 'destructive',
          });
        }
      }
    };
    createIntent();
  }, [total, setError]);

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();
    setPlacingOrder(true);
    setError && setError(null);
    setSuccess && setSuccess(null);
    setAddressError(null);
    setCardError(null);
    try {
      if (!selectedAddress) {
        setAddressError('Please select a shipping address');
        toast({
          title: 'Error',
          description: 'Please select a shipping address',
          variant: 'destructive',
        });
        setPlacingOrder(false);
        return;
      }
      if (!stripe || !elements || !clientSecret) {
        setCardError('Payment not ready');
        toast({
          title: 'Error',
          description: 'Payment not ready',
          variant: 'destructive',
        });
        setPlacingOrder(false);
        return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError('Card input not found');
        toast({
          title: 'Error',
          description: 'Card input not found',
          variant: 'destructive',
        });
        setPlacingOrder(false);
        return;
      }
      // Confirm card payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      if (stripeError || !paymentIntent || paymentIntent.status !== 'succeeded') {
        setCardError(stripeError?.message || 'Payment failed');
        toast({
          title: 'Error',
          description: stripeError?.message || 'Payment failed',
          variant: 'destructive',
        });
        setPlacingOrder(false);
        return;
      }
      // Place order
      const items = cart.map((item: any) => ({
        productId: item.product._id,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        size: item.selectedSize,
        color: item.selectedColor
      }));
      await ordersAPI.createOrder({
        items,
        shippingAddress: selectedAddress,
        paymentMethod: 'card',
        orderNumber: 'ORD-' + Date.now(),
        totalAmount: total,
        status: 'pending'
      });
      setSuccess && setSuccess('Order placed successfully!');
      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      });
      setTimeout(() => navigate('/my-orders'), 1500);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <form onSubmit={handlePlaceOrder}>
      <Card className="border-0 shadow-luxury mb-6">
        <CardHeader>
          <CardTitle className="font-playfair text-xl">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-muted-foreground">No addresses found. Please add an address in your profile.</div>
          ) : (
            <select
              className="w-full border rounded px-2 py-2 mt-2"
              value={selectedAddress}
              onChange={e => setSelectedAddress(e.target.value)}
            >
              {addresses.map((addr: Address) => (
                <option key={addr._id} value={addr._id}>
                  {addr.street}, {addr.city}, {addr.state}, {addr.zip}
                </option>
              ))}
            </select>
          )}
          {addressError && <div className="text-red-600 mt-2">{addressError}</div>}
        </CardContent>
      </Card>
      <Card className="border-0 shadow-luxury mb-6">
        <CardHeader>
          <CardTitle className="font-playfair text-xl">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          {cardError && <div className="text-red-600 mt-2">{cardError}</div>}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button className="bg-luxury-gradient px-6 py-3 text-base" type="submit" disabled={placingOrder || loading || cart.length === 0}>
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
};

const AddressForm = ({ onAdd, loading, onSuccess }: { onAdd: (address: any) => void, loading: boolean, onSuccess: () => void }) => {
  const [type, setType] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!type || !street || !city || !state || !zip) {
      setError('All fields are required');
      return;
    }
    try {
      await onAdd({ type, street, city, state, zip, isDefault });
      setType('Home'); setStreet(''); setCity(''); setState(''); setZip(''); setIsDefault(false);
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to add address');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Card className="border-0 shadow-luxury">
        <CardHeader className="flex flex-row items-center gap-3 pb-0">
          <Home className="h-7 w-7 text-accent" />
          <CardTitle className="font-playfair text-xl">Add New Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Type</label>
              <select className="w-full border rounded h-12 px-4 text-base" value={type} onChange={e => setType(e.target.value)}>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="relative">
              <input id="street" className="peer w-full border rounded h-12 px-4 text-base pt-5 focus:outline-none focus:border-accent" value={street} onChange={e => setStreet(e.target.value)} />
              <label htmlFor="street" className="absolute left-4 top-2 text-xs text-muted-foreground peer-focus:text-accent transition-all duration-200">Street</label>
            </div>
            <div className="relative">
              <input id="city" className="peer w-full border rounded h-12 px-4 text-base pt-5 focus:outline-none focus:border-accent" value={city} onChange={e => setCity(e.target.value)} />
              <label htmlFor="city" className="absolute left-4 top-2 text-xs text-muted-foreground peer-focus:text-accent transition-all duration-200">City</label>
            </div>
            <div className="relative">
              <input id="state" className="peer w-full border rounded h-12 px-4 text-base pt-5 focus:outline-none focus:border-accent" value={state} onChange={e => setState(e.target.value)} />
              <label htmlFor="state" className="absolute left-4 top-2 text-xs text-muted-foreground peer-focus:text-accent transition-all duration-200">State</label>
            </div>
            <div className="relative">
              <input id="zip" className="peer w-full border rounded h-12 px-4 text-base pt-5 focus:outline-none focus:border-accent" value={zip} onChange={e => setZip(e.target.value)} />
              <label htmlFor="zip" className="absolute left-4 top-2 text-xs text-muted-foreground peer-focus:text-accent transition-all duration-200">Zip</label>
            </div>
            <div className="flex items-center mt-6 h-12">
              <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="mr-2 h-5 w-5 align-middle" style={{marginTop: 0}} />
              <label className="text-base align-middle">Set as default</label>
            </div>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">Address added!</div>}
          <Button className="bg-luxury-gradient mt-4" type="submit" disabled={loading}>Add Address</Button>
        </CardContent>
      </Card>
    </form>
  );
};

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cartData = await cartAPI.getCart();
        setCart(cartData);
        const addressData = await addressesAPI.getUserAddresses();
        setAddresses(addressData);
        if (addressData.length > 0) setSelectedAddress(addressData[0]._id);
      } catch (err) {
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddAddress = async (address: any) => {
    setAddressLoading(true);
    try {
      const newAddr = await addressesAPI.addAddress(address);
      const addressData = await addressesAPI.getUserAddresses();
      setAddresses(addressData);
      setSelectedAddress(newAddr._id);
    } finally {
      setAddressLoading(false);
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
              Checkout
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              Review your order and complete your purchase.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            {showAddressForm ? (
              <>
                <div className="flex justify-end mb-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>
                    Cancel
                  </Button>
                </div>
                <AddressForm onAdd={handleAddAddress} loading={addressLoading} onSuccess={() => setShowAddressForm(false)} />
              </>
            ) : (
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowAddressForm(true)}>
                <Plus className="h-5 w-5" /> Add New Address
              </Button>
            )}
          </div>
          <Card className="border-0 shadow-luxury mb-6">
            <CardHeader>
              <CardTitle className="font-playfair text-xl">Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading cart...</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button className="mt-4 bg-luxury-gradient" onClick={() => navigate('/collections')}>Shop Now</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded object-cover border"
                      />
                      <div className="flex-1">
                        <h4 className="font-playfair font-semibold text-base">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                        <Badge variant="secondary">{item.product.category}</Badge>
                        <div className="mt-1 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <span className="font-playfair font-bold text-accent text-base">
                        Rs {item.product.price.toLocaleString()} x {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-5">
                    <span className="font-playfair text-lg font-bold text-accent">Total</span>
                    <span className="font-playfair text-xl text-accent font-bold">Rs {total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              cart={cart}
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              total={total}
              loading={loading}
              placingOrder={placingOrder}
              setPlacingOrder={setPlacingOrder}
              setError={setError}
              setSuccess={setSuccess}
              navigate={navigate}
            />
          </Elements>
          {success && <div className="text-green-600 mt-4 text-center">{success}</div>}
          {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout; 