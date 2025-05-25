
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, CheckCircle, AlertCircle, Mail, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { mockProducts, mockEnquiries, getStoredData } from '../../services/mockData';

const VendorDashboard: React.FC = () => {
  const products = getStoredData('products', mockProducts);
  const enquiries = getStoredData('enquiries', mockEnquiries);

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stockStatus === 'in-stock').length;
  const outOfStockProducts = products.filter(p => p.stockStatus === 'out-of-stock').length;
  const lowStockProducts = products.filter(p => p.stockStatus === 'low-stock').length;

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
  const avgProductPrice = totalProducts > 0 ? totalRevenue / totalProducts : 0;

  const kpiCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active listings'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(totalRevenue * 0.1).toFixed(0)}`,
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'This month'
    },
    {
      title: 'Active Enquiries',
      value: newEnquiries,
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Pending responses'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Enquiry to sale'
    }
  ];

  const stockCards = [
    {
      title: 'In Stock',
      value: inStockProducts,
      percentage: totalProducts > 0 ? (inStockProducts / totalProducts) * 100 : 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      percentage: totalProducts > 0 ? (lowStockProducts / totalProducts) * 100 : 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      percentage: totalProducts > 0 ? (outOfStockProducts / totalProducts) * 100 : 0,
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

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold mb-1">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stockCards.map((stock, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${stock.bgColor}`}>
                      <stock.icon className={`h-4 w-4 ${stock.color}`} />
                    </div>
                    <span className="font-medium">{stock.title}</span>
                  </div>
                  <span className="text-2xl font-bold">{stock.value}</span>
                </div>
                <Progress value={stock.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {stock.percentage.toFixed(1)}% of total products
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
