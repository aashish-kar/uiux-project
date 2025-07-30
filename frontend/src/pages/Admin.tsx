import { OrderForm } from '@/components/admin/OrderForm';
import { ProductForm } from '@/components/admin/ProductForm';
import { createCustomerColumns, createOrderColumns, createProductColumns } from '@/components/admin/table-columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { adminAPI, Order, OrderUpdate, Product, User as UserType } from '@/services/api';
import {
  BarChart3,
  Calendar,
  Crown,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed contactAPI and Contact import

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<UserType | null>(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!adminAPI.isAdmin()) {
      console.log('Admin page - User is not admin, current user:', user);
      console.log('Admin page - User role:', user?.role);
      navigate('/');
      return;
    }

    loadData();
  }, [isAuthenticated, navigate, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, customersData] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getAllUsers()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD operations
  const handleAddProduct = async (data: FormData) => {
    try {
      setFormLoading(true);
      await adminAPI.createProduct(data);
      setShowProductForm(false);
      setEditingProduct(null);
      await loadData();
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (data: FormData) => {
    if (!editingProduct) return;
    try {
      setFormLoading(true);
      await adminAPI.updateProduct(editingProduct._id, data);
      setShowProductForm(false);
      setEditingProduct(null);
      await loadData();
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        await loadData();
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    console.log('View product:', product);
    toast({
      title: "Product Details",
      description: `Viewing ${product.name}`,
    });
  };

  // Order CRUD operations
  const handleAddOrder = async (data: OrderUpdate) => {
    try {
      setFormLoading(true);
      await adminAPI.createOrder(data);
      setShowOrderForm(false);
      setEditingOrder(null);
      await loadData();
      toast({
        title: "Success",
        description: "Order created successfully!",
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateOrder = async (data: OrderUpdate) => {
    if (!editingOrder) return;
    try {
      setFormLoading(true);
      await adminAPI.updateOrder(editingOrder._id, data);
      setShowOrderForm(false);
      setEditingOrder(null);
      await loadData();
      toast({
        title: "Success",
        description: "Order updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update order:', error);
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await adminAPI.deleteOrder(orderId);
        await loadData();
        toast({
          title: "Success",
          description: "Order deleted successfully!",
        });
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast({
          title: "Error",
          description: "Failed to delete order. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewOrder = (order: Order) => {
    console.log('View order:', order);
    toast({
      title: "Order Details",
      description: `Viewing order ${order._id.substring(0, 8)}...`,
    });
  };

  // Customer CRUD operations
  // Remove customerColumns and related handlers if no API for customer add/delete

  // Removed handleDeleteContact

  // Debug function to manually set admin role
  const setAdminRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      userData.role = 'admin';
      localStorage.setItem('user', JSON.stringify(userData));
      window.location.reload();
    }
  };

  // Create columns with handlers
  const productColumns = createProductColumns(handleEditProduct, handleDeleteProduct, handleViewProduct);
  const handleOrderStatusChange = async (order: Order, status: string) => {
    try {
      setFormLoading(true);
      await adminAPI.updateOrder(order._id, { status });
      await loadData();
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };
  const orderColumns = createOrderColumns(handleEditOrder, handleDeleteOrder, handleViewOrder, handleOrderStatusChange);
  // Remove customerColumns and related handlers if no API for customer add/delete

  if (!isAuthenticated || !adminAPI.isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
      {/* Enhanced Header */}
      <header className="bg-background/95 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-luxury">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-luxury-gradient rounded-xl flex items-center justify-center shadow-luxury-glow">
                  <Crown className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="font-playfair text-2xl font-bold text-foreground">watchShop Admin</h1>
                  <p className="text-xs text-muted-foreground">Luxury Watch Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-luxury-gradient" onClick={() => window.location.href = '/'}>
                Go to Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-background/70 backdrop-blur-md border border-border/30 shadow-glass h-14 p-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground data-[state=active]:shadow-luxury-glow flex items-center gap-2 font-medium transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground data-[state=active]:shadow-luxury-glow flex items-center gap-2 font-medium transition-all duration-300"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground data-[state=active]:shadow-luxury-glow flex items-center gap-2 font-medium transition-all duration-300"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-accent-foreground data-[state=active]:shadow-luxury-glow flex items-center gap-2 font-medium transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            {/* Removed Contacts tab trigger */}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-luxury-gradient rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold text-foreground">{products.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-luxury-gradient rounded-xl flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-luxury-gradient rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold text-foreground">{customers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-luxury-gradient rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Selling Products Widget */}
            <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    // Aggregate product sales from all orders
                    const salesMap = new Map();
                    orders.forEach(order => {
                      (order.items || []).forEach(item => {
                        const id = item.product?._id || item.product;
                        if (!id) return;
                        const prev = salesMap.get(id) || { name: item.product?.name || 'Unknown', image: item.product?.image, sold: 0 };
                        salesMap.set(id, { ...prev, sold: prev.sold + item.quantity });
                      });
                    });
                    const topProducts = Array.from(salesMap.values())
                      .sort((a, b) => b.sold - a.sold)
                      .slice(0, 3);
                    if (topProducts.length === 0) return <div className="text-muted-foreground">No sales data yet.</div>;
                    return topProducts.map((prod, idx) => (
                      <div key={prod.name + idx} className="flex items-center gap-4 p-3 bg-white/80 rounded-lg">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded object-cover border" />
                        ) : (
                          <div className="w-14 h-14 rounded bg-muted flex items-center justify-center text-muted-foreground">N/A</div>
                        )}
                        <div className="flex-1">
                          <div className="font-playfair font-semibold text-base">{prod.name}</div>
                          <div className="text-xs text-muted-foreground">Total Sold: <span className="font-bold text-accent">{prod.sold}</span></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-foreground">Order Management</h2>
                <p className="text-muted-foreground mt-1">Track and manage luxury watch orders</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setEditingOrder(null);
                    setShowOrderForm(true);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter by Date
                </Button>
                <Button
                  className="bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300"
                  onClick={() => {
                    setEditingOrder(null);
                    setShowOrderForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading orders...</p>
                  </div>
                ) : (
                  <DataTable
                    columns={orderColumns}
                    data={orders}
                    searchKey="user"
                    searchPlaceholder="Search orders..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-foreground">Product Catalog</h2>
                <p className="text-muted-foreground mt-1">Manage your luxury watch collection</p>
              </div>
              <Button
                className="bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Luxury Watch
              </Button>
            </div>

            <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading products...</p>
                  </div>
                ) : (
                  <DataTable
                    columns={productColumns}
                    data={products}
                    searchKey="name"
                    searchPlaceholder="Search products..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-foreground">Customer Relations</h2>
                <p className="text-muted-foreground mt-1">Manage your distinguished clientele</p>
              </div>
              {/* CustomerForm removed: No backend API for customer add/delete */}
            </div>

            <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading customers...</p>
                  </div>
                ) : (
                  <DataTable
                    columns={createCustomerColumns(null, null, null)} // No customer columns to display
                    data={customers}
                    searchKey="email"
                    searchPlaceholder="Search customers..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab removed */}
        </Tabs>
      </div>

      {/* Forms */}
      <ProductForm
        open={showProductForm}
        onOpenChange={setShowProductForm}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        product={editingProduct}
        loading={formLoading}
      />

      <OrderForm
        open={showOrderForm}
        onOpenChange={setShowOrderForm}
        onSubmit={editingOrder ? handleUpdateOrder : handleAddOrder}
        order={editingOrder}
        loading={formLoading}
      />

      {/* CustomerForm removed: No backend API for customer add/delete */}
    </div>
  );
};

export default Admin;
