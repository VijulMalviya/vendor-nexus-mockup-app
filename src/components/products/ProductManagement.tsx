
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2, Filter, Package } from 'lucide-react';
import { Product, mockProducts, getStoredData, setStoredData, productCategories } from '../../services/mockData';
import ProductForm from './ProductForm';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(getStoredData('products', mockProducts));
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.subheading.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === 'all' || product.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'oldest') return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      return 0;
    });

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'vendorId' | 'uploadDate'>) => {
    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData }
          : p
      );
      setProducts(updatedProducts);
      setStoredData('products', updatedProducts);
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        vendorId: '1',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setStoredData('products', updatedProducts);
    }
    
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      setStoredData('products', updatedProducts);
    }
  };

  const handleStatusChange = (productId: string, newStatus: string) => {
    const updatedProducts = products.map(p => 
      p.id === productId 
        ? { ...p, stockStatus: newStatus as 'in-stock' | 'low-stock' | 'out-of-stock' }
        : p
    );
    setProducts(updatedProducts);
    setStoredData('products', updatedProducts);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {productCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || categoryFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter 
                  ? "Try adjusting your search criteria" 
                  : "Start by adding your first product to the catalog"
                }
              </p>
              {!searchTerm && !categoryFilter && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.subheading}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {product.categories.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>
                      <Select 
                        value={product.stockStatus} 
                        onValueChange={(value) => handleStatusChange(product.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge className={getStockStatusColor(product.stockStatus)}>
                              {product.stockStatus.replace('-', ' ')}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(product.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
