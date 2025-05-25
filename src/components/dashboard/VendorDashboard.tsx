
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { mockProducts, mockEnquiries, getStoredData } from '../../services/mockData';

const VendorDashboard: React.FC = () => {
  const products = getStoredData('products', mockProducts);
  const enquiries = getStoredData('enquiries', mockEnquiries);

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stockStatus === 'in-stock').length;
  const outOfStockProducts = products.filter(p => p.stockStatus === 'out-of-stock').length;
  const lowStockProducts = products.filter(p => p.stockStatus === 'low-stock').length;

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const kpiCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'In Stock',
      value: inStockProducts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-blue-100">Here's what's happening with your marketplace today.</p>
      </div>

      {/* Profile Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Profile Complete
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your vendor profile has been verified and is now active in the marketplace.
              </p>
            </div>
            <Progress value={100} className="w-24" />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Enquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Enquiries</CardTitle>
            <Badge variant="secondary">{newEnquiries} New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enquiries.slice(0, 5).map((enquiry) => (
              <div 
                key={enquiry.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{enquiry.buyerName}</h4>
                    <Badge 
                      variant={enquiry.status === 'new' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {enquiry.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {enquiry.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(enquiry.date).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${enquiry.buyerEmail}?subject=Re: Product Enquiry`)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            ))}
            
            {enquiries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No enquiries yet</p>
                <p className="text-sm">Enquiries from buyers will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
