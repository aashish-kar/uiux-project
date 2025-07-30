import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order, OrderUpdate } from '@/services/api';

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OrderUpdate) => Promise<void>;
  order?: Order | null;
  loading?: boolean;
}

export const OrderForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  order, 
  loading = false 
}: OrderFormProps) => {
  const [formData, setFormData] = useState({
    status: 'pending' as Order['status'],
    totalAmount: '',
    paymentMethod: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'pending',
        totalAmount: order.totalAmount?.toString() || '',
        paymentMethod: order.paymentMethod || '',
        shippingAddress: {
          street: order.shippingAddress?.street || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          zip: order.shippingAddress?.zip || ''
        }
      });
    } else {
      setFormData({
        status: 'pending',
        totalAmount: '',
        paymentMethod: '',
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zip: ''
        }
      });
    }
  }, [order, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
    };
    await onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {order ? 'Update Order' : 'Create New Order'}
          </DialogTitle>
          <DialogDescription>
            {order ? 'Update the order information below.' : 'Fill in the order information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show order items with customization fields if present */}
          {order && order.items && order.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Order Items</h3>
              {order.items.map((item, idx) => (
                <div key={item._id || idx} className="p-3 border rounded-lg bg-muted/10">
                  <div className="font-playfair font-bold text-base">{item.product?.name || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity} | Rs {(item.product?.price || 0).toLocaleString?.() || 0}</div>
                  {item.strapType && <div className="text-xs mt-1">Strap: <span className="font-semibold">{item.strapType}</span></div>}
                  {item.dialColor && <div className="text-xs">Dial: <span className="font-semibold">{item.dialColor}</span></div>}
                  {item.engraving && <div className="text-xs">Engraving: <span className="font-semibold">{item.engraving}</span></div>}
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Order Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as Order['status']})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount ($) *</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Input
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                placeholder="Credit Card, PayPal, etc."
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street *</Label>
                <Input
                  id="street"
                  value={formData.shippingAddress.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, street: e.target.value}
                  })}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.shippingAddress.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, city: e.target.value}
                  })}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.shippingAddress.state}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, state: e.target.value}
                  })}
                  placeholder="NY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.shippingAddress.zip}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, zip: e.target.value}
                  })}
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (order ? 'Update Order' : 'Create Order')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 