import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { ordersAPI, Order } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await ordersAPI.getUserOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
              My <span className="text-accent">Orders</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              View your order history and track your purchases.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <Card className="border-0 shadow-luxury">
            <CardHeader>
              <CardTitle className="font-playfair text-xl flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-accent" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Button className="mt-4 bg-luxury-gradient" onClick={() => navigate('/')}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
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
                      <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order._id}`)}>
                        View Details
                      </Button>
                    </div>
                  ))}
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

export default MyOrders; 