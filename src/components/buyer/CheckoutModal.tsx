
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Truck, MapPin, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  total: number;
  onOrderComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  total,
  onOrderComplete
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setStep(3);
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      });
    }, 2000);
  };

  const handleOrderComplete = () => {
    onOrderComplete();
    toast({
      title: "Order Confirmed!",
      description: "You will receive a confirmation email shortly.",
    });
  };

  const renderShippingForm = () => (
    <form onSubmit={handleShippingSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={shippingInfo.firstName}
            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={shippingInfo.lastName}
            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={shippingInfo.email}
          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={shippingInfo.state}
            onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nameOnCard">Name on Card</Label>
        <Input
          id="nameOnCard"
          value={paymentInfo.nameOnCard}
          onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={paymentInfo.expiryDate}
            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back to Shipping
        </Button>
        <Button type="submit" className="flex-1">
          Place Order
        </Button>
      </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold">Order Confirmed!</h3>
      <p className="text-gray-600">
        Your order #ORD-{Date.now()} has been placed successfully.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Estimated delivery: 3-5 business days
        </p>
        <p className="text-sm text-gray-600">
          You will receive tracking information via email.
        </p>
      </div>
      <Button onClick={handleOrderComplete} className="w-full">
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Shipping Information"}
            {step === 2 && "Payment Information"}
            {step === 3 && "Order Confirmation"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mb-6">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-sm">Shipping</span>
              </div>
              <div className={`h-px flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-sm">Payment</span>
              </div>
              <div className={`h-px flex-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm">Complete</span>
              </div>
            </div>

            {/* Form Content */}
            {step === 1 && renderShippingForm()}
            {step === 2 && renderPaymentForm()}
            {step === 3 && renderConfirmation()}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
