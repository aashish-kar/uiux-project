import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Heart, ShoppingBag, Clock, Settings, Edit, Shield, Bell, Star, Gift, Calendar, MapPin } from 'lucide-react';
import { authAPI, ordersAPI, wishlistAPI, User as UserType, Order, Product, addressesAPI, Address, userAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AddressForm = ({ onAdd, loading }: { onAdd: (address: any) => void, loading: boolean }) => {
  const [type, setType] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!type || !street || !city || !state || !zip) {
      setError('All fields are required');
      return;
    }
    try {
      await onAdd({ type, street, city, state, zip, isDefault });
      setType('Home'); setStreet(''); setCity(''); setState(''); setZip(''); setIsDefault(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to add address');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Card className="border-0 shadow-luxury">
        <CardHeader>
          <CardTitle className="font-playfair text-2xl">Add New Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Type</label>
              <select className="w-full border rounded px-2 py-2" value={type} onChange={e => setType(e.target.value)}>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Street</label>
              <input className="w-full border rounded px-2 py-2" value={street} onChange={e => setStreet(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <input className="w-full border rounded px-2 py-2" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1">State</label>
              <input className="w-full border rounded px-2 py-2" value={state} onChange={e => setState(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1">Zip</label>
              <input className="w-full border rounded px-2 py-2" value={zip} onChange={e => setZip(e.target.value)} />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="mr-2" />
              <label>Set as default</label>
            </div>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          <Button className="bg-luxury-gradient mt-4" type="submit" disabled={loading}>Add Address</Button>
        </CardContent>
      </Card>
    </form>
  );
};

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { logout } = authAPI;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
          setError('User not authenticated');
          return;
        }
        setUser(currentUser);
        setEditData({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          phone: currentUser.phone || '',
        });

        // Fetch user orders
        try {
          const orders = await ordersAPI.getUserOrders();
          setUserOrders(orders);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setUserOrders([]);
        }

        // Fetch wishlist items
        try {
          const wishlist = await wishlistAPI.getWishlist();
          setWishlistItems(wishlist);
        } catch (err) {
          console.error('Error fetching wishlist:', err);
          setWishlistItems([]);
        }

        // Fetch addresses
        try {
          const addressData = await addressesAPI.getUserAddresses();
          setAddresses(addressData);
        } catch (err) {
          // ignore for now
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddAddress = async (address: any) => {
    setAddressLoading(true);
    try {
      await addressesAPI.addAddress(address);
      const addressData = await addressesAPI.getUserAddresses();
      setAddresses(addressData);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userAPI.updateProfile({
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
      });
      setUser(updated);
      setEditing(false);
      toast({ title: 'Profile updated', description: 'Your information has been updated.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center space-y-6 animate-fade-in-up">
              <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground">
                My <span className="text-accent">Profile</span>
              </h1>
              <p className="font-inter text-xl text-muted-foreground max-w-3xl mx-auto">
                Manage your account, view your collection, and track your journey.
              </p>
            </div>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-0 shadow-luxury animate-pulse">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded w-32 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                  </CardHeader>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-0 shadow-luxury animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-48"></div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-10 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <section className="relative pt-24 pb-16 bg-luxury-gradient-subtle overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center space-y-6 animate-fade-in-up">
              <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground">
                My <span className="text-accent">Profile</span>
              </h1>
              <p className="font-inter text-xl text-muted-foreground max-w-3xl mx-auto">
                {error || 'Please log in to view your profile'}
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-luxury-gradient"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
              <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground">
              My <span className="text-accent">Profile</span>
            </h1>
            <p className="font-inter text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage your account, view your collection, and track your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-luxury">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop" />
                    <AvatarFallback className="bg-luxury-gradient text-2xl font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-playfair text-xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <p className="text-muted-foreground">Member</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer" onClick={() => navigate('/my-orders')}>
                    <ShoppingBag className="w-5 h-5 text-accent" />
                    <span>Order History</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer" onClick={() => navigate('/wishlist')}>
                    <Heart className="w-5 h-5 text-accent" />
                    <span>Wishlist</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full mt-4">
                        Logout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to logout?</DialogTitle>
                        <DialogDescription>This will end your current session.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                        <Button variant="destructive" onClick={() => { 
                          logout(); 
                          navigate('/login');
                          toast({
                            title: "Successfully signed out",
                            description: "You have been logged out of your account.",
                          });
                        }}>
                    Logout
                  </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Account Information */}
              <Card className="border-0 shadow-luxury">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-playfair text-xl">Account Information</CardTitle>
                  {!editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={editing ? editData.firstName : user.firstName || ''} onChange={editing ? handleEditChange : undefined} readOnly={!editing} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={editing ? editData.lastName : user.lastName || ''} onChange={editing ? handleEditChange : undefined} readOnly={!editing} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={editing ? editData.phone : user.phone || ''} onChange={editing ? handleEditChange : undefined} readOnly={!editing} className="mt-1" />
                    </div>
                  </div>
                 {editing && (
                   <div className="flex gap-4 mt-4">
                     <Button onClick={handleSave} disabled={saving} className="bg-luxury-gradient">
                       {saving ? 'Saving...' : 'Save'}
                     </Button>
                     <Button variant="outline" onClick={() => { setEditing(false); setEditData({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' }); }}>
                       Cancel
                     </Button>
                   </div>
                 )}
                </CardContent>
              </Card>
              {/* Address Management */}
              <AddressForm onAdd={handleAddAddress} loading={addressLoading} />
              <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">My Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-muted-foreground">No addresses found.</div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map(addr => (
                        <div key={addr._id} className="p-3 border rounded-lg flex flex-col md:flex-row md:items-center md:space-x-3">
                          <div className="flex-1">
                            <div className="font-semibold">{addr.type}</div>
                            <div>{addr.street}, {addr.city}, {addr.state}, {addr.zip}</div>
                            {addr.isDefault && <Badge className="mt-2">Default</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-accent" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length > 0 ? (
                    <div className="space-y-3">
                      {userOrders.slice(0, 3).map((order) => (
                        <div key={order._id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/30">
                          <img
                            src={order.items[0]?.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"}
                            alt="Product"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-playfair font-semibold">
                              {order.items[0]?.product?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Order #{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                          <span className="font-playfair font-bold text-accent">
                            Rs {order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button className="mt-4 bg-luxury-gradient" onClick={() => navigate('/collections')}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Wishlist */}
              <Card className="border-0 shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-accent" />
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {wishlistItems.slice(0, 4).map((item) => (
                        <div key={item._id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/30">
                          <img
                            src={item.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"}
                            alt={item.product?.name || 'Product'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-playfair font-semibold">
                              {item.product?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {item.product?.brand || 'Brand'}
                            </p>
                          </div>
                          <span className="font-playfair font-bold text-accent">
                            Rs {item.product?.price?.toLocaleString() || '0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your wishlist is empty</p>
                      <Button className="mt-4 bg-luxury-gradient" onClick={() => navigate('/collections')}>
                        Discover Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
