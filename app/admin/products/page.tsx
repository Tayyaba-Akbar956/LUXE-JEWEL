'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(product => product.id !== id));
    } else {
      alert('Error deleting product: ' + error.message);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedProduct: any) => {
    if (updatedProduct.id) {
      // Update
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          price: updatedProduct.price,
          compare_price: updatedProduct.compare_price,
          description: updatedProduct.description,
          short_description: updatedProduct.short_description,
          inventory_quantity: updatedProduct.inventory_quantity,
          is_featured: updatedProduct.is_featured,
          featured_image: updatedProduct.featured_image,
          is_active: updatedProduct.is_active
        })
        .eq('id', updatedProduct.id)
        .select()
        .single();

      if (!error) {
        fetchProducts();
        setIsDialogOpen(false);
      } else {
        alert('Error updating product: ' + error.message);
      }
    } else {
      // Create
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          price: updatedProduct.price,
          compare_price: updatedProduct.compare_price,
          description: updatedProduct.description,
          short_description: updatedProduct.short_description,
          inventory_quantity: updatedProduct.inventory_quantity,
          is_featured: updatedProduct.is_featured,
          featured_image: updatedProduct.featured_image,
          is_active: true
        }])
        .select()
        .single();

      if (!error) {
        fetchProducts();
        setIsDialogOpen(false);
      } else {
        alert('Error creating product: ' + error.message);
      }
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl text-champagne-200">Product Management</h1>
        <Button onClick={handleCreate} className="bg-gold-500 text-luxury-black hover:bg-gold-400">
          Add Product
        </Button>
      </div>

      <div className="card-luxury p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-luxury-dark border-gold-500/30 text-champagne-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="rounded-md border border-gold-500/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gold-500/20 hover:bg-transparent">
                <TableHead className="text-silver-400">Product</TableHead>
                <TableHead className="text-silver-400">Category</TableHead>
                <TableHead className="text-silver-400">Price</TableHead>
                <TableHead className="text-silver-400">Inventory</TableHead>
                <TableHead className="text-silver-400">Status</TableHead>
                <TableHead className="text-silver-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-silver-500">Loading products...</TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-silver-500">No products found.</TableCell>
                </TableRow>
              ) : filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-b border-gold-500/10 hover:bg-luxury-dark/50">
                  <TableCell className="font-medium text-champagne-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden border border-gold-500/20 bg-luxury-black">
                        {product.featured_image && (
                          <img
                            src={product.featured_image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div>{product.name}</div>
                        <div className="text-xs text-silver-500">{product.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize border-gold-500/30 text-silver-400">
                      {product.categories?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-champagne-200">
                    ${parseFloat(product.price).toFixed(2)}
                    {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                      <span className="text-silver-500 text-xs line-through ml-2">
                        ${parseFloat(product.compare_price).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-champagne-200">{product.inventory_quantity}</div>
                    <div className={`text-xs ${product.inventory_quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.inventory_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.is_featured && (
                        <Badge className="bg-gold-500/20 text-gold-500 border-gold-500/30 text-xs">
                          Featured
                        </Badge>
                      )}
                      {!product.is_active && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
}

// Product Dialog Component
function ProductDialog({
  isOpen,
  onClose,
  product,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSave: (product: any) => void;
}) {
  const [formData, setFormData] = useState<any>({
    id: null,
    name: '',
    slug: '',
    price: 0,
    compare_price: 0,
    category_id: 1,
    featured_image: '',
    description: '',
    short_description: '',
    inventory_quantity: 0,
    is_featured: false,
    is_active: true
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();

    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compare_price: product.compare_price || 0,
        category_id: product.category_id,
        featured_image: product.featured_image,
        description: product.description,
        short_description: product.short_description,
        inventory_quantity: product.inventory_quantity,
        is_featured: product.is_featured,
        is_active: product.is_active
      });
    } else {
      setFormData({
        id: null,
        name: '',
        slug: '',
        price: 0,
        compare_price: 0,
        category_id: 1,
        featured_image: '',
        description: '',
        short_description: '',
        inventory_quantity: 0,
        is_featured: false,
        is_active: true
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as any).checked : value;

    setFormData((prev: any) => ({
      ...prev,
      [name]: (name === 'price' || name === 'compare_price' || name === 'inventory_quantity' || name === 'category_id') && type !== 'checkbox'
        ? (value === '' ? 0 : parseFloat(value))
        : val
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-luxury-dark border-gold-500/30 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-champagne-200 text-2xl font-display">
            {product ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-luxury-black border-gold-500/30 text-champagne-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Slug</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="bg-luxury-black border-gold-500/30 text-silver-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Price ($)</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bg-luxury-black border-gold-500/30 text-champagne-200"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Compare Price ($)</label>
              <Input
                type="number"
                name="compare_price"
                value={formData.compare_price}
                onChange={handleChange}
                className="bg-luxury-black border-gold-500/30 text-champagne-200"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full h-10 bg-luxury-black border border-gold-500/30 rounded-md px-3 text-champagne-200 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-silver-400">Featured Image URL</label>
            <Input
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className="bg-luxury-black border-gold-500/30 text-champagne-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-silver-400">Short Description</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-luxury-black border border-gold-500/30 rounded-md px-3 py-2 text-champagne-200 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-silver-400">Main Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full bg-luxury-black border border-gold-500/30 rounded-md px-3 py-2 text-champagne-200 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-400">Inventory Quantity</label>
              <Input
                type="number"
                name="inventory_quantity"
                value={formData.inventory_quantity}
                onChange={handleChange}
                className="bg-luxury-black border-gold-500/30 text-champagne-200"
                required
                min="0"
              />
            </div>

            <div className="flex gap-6 pb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleCheckboxChange('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-gold-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-silver-300 cursor-pointer">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleCheckboxChange('is_active', e.target.checked)}
                  className="w-4 h-4 accent-gold-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-silver-300 cursor-pointer">
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gold-500/30 text-silver-400 hover:bg-gold-500/10 hover:text-gold-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gold-500 text-luxury-black hover:bg-gold-400 px-8"
            >
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}