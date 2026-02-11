'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '../../../src/components/ui/button';
import { Input } from '../../../src/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../src/components/ui/table';
import { Badge } from '../../../src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../src/components/ui/select';
import { supabase } from '@/lib/supabase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.profiles?.full_name && order.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-900/30 text-green-400 border-green-700/30';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700/30';
      case 'processing':
        return 'bg-blue-900/30 text-blue-400 border-blue-700/30';
      case 'shipped':
        return 'bg-purple-900/30 text-purple-400 border-purple-700/30';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400 border-red-700/30';
      default:
        return 'bg-silver-800 text-silver-400 border-silver-700/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-champagne-200">Order Management</h1>
        <p className="text-silver-500">Manage and track customer orders</p>
      </div>

      <div className="card-luxury p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-luxury-dark border-gold-500/30 text-champagne-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-luxury-dark border-gold-500/30">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-gold-500/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gold-500/20 hover:bg-transparent">
                <TableHead className="text-silver-400">Order Number</TableHead>
                <TableHead className="text-silver-400">Customer</TableHead>
                <TableHead className="text-silver-400">Date</TableHead>
                <TableHead className="text-silver-400">Total</TableHead>
                <TableHead className="text-silver-400">Status</TableHead>
                <TableHead className="text-silver-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-silver-500">Loading orders...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-silver-500">No orders found.</TableCell>
                </TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-b border-gold-500/10 hover:bg-luxury-dark/50">
                  <TableCell className="font-medium text-champagne-200">
                    <div>{order.order_number}</div>
                    <div className="text-[10px] text-silver-500 font-mono uppercase">{order.payment_method} - {order.payment_status}</div>
                  </TableCell>
                  <TableCell className="text-champagne-200">
                    <div className="flex items-center gap-2">
                      {order.profiles?.avatar_url && (
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gold-500/20">
                          <img src={order.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span>{order.profiles?.full_name || 'Guest'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-silver-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-champagne-200">${parseFloat(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: string) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-luxury-dark border-gold-500/30">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}