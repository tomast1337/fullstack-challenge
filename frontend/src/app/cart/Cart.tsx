'use client';

import { Button } from '@frontend/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@frontend/components/ui/table';
import { useOrder } from '@frontend/hooks/use-order';
import { useToast } from '@frontend/hooks/use-toast';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import Link from 'next/link';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
export const Cart = () => {
  const { toast } = useToast();
  const { order, fetchOrder, completeOrder, cancelOrder } = useOrder(
    useShallow((state) => ({
      ...state,
    })),
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleFinishOrder = () => {
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order is empty',
      });
      return;
    }
    if (order.orderItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Order is empty',
      });
      return;
    }
    try {
      completeOrder();
      toast({
        title: 'Success',
        description: 'Order completed',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again',
      });
    }
  };

  const handleCancelOrder = () => {
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order is empty',
      });
      return;
    }
    if (order.orderItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Order is empty',
      });
      return;
    }
    try {
      cancelOrder();
      toast({
        title: 'Success',
        description: 'Order canceled',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again',
      });
    }
  };

  return (
    <section className='container mx-auto p-4 min-h-screen flex flex-col items-center w-full'>
      <h1 className='text-2xl font-bold mb-4'>Cart</h1>
      {order && (
        <div className='w-full flex justify-center flex-col items-center'>
          <div className='overflow-x-auto max-w-[600px] w-full'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Individual price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total price</TableHead>
                  <TableHead>
                    <DeleteIcon />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map(
                  ({ name, price, productId, quantity }) => (
                    <TableRow key={productId}>
                      <TableCell>
                        <Link
                          className='text-blue-500'
                          href={`/product/${productId}`}
                        >
                          {name}
                        </Link>
                      </TableCell>
                      <TableCell>{`$ ${price.toFixed(2)}`}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{`$ ${(price * quantity).toFixed(2)}`}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            console.log('remove');
                          }}
                        >
                          <DeleteIcon />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
                {
                  // if length of orderItems is 0 show empty cart with 20 rows
                  order.orderItems.length === 0 &&
                    Array.from({ length: 20 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </div>
          {/*
            Finish or Cancel order
          */}
          <div className='flex flex-row items-center gap-6'>
            <Button className='bg-green-500' onClick={handleFinishOrder}>
              <PaymentIcon />
              Finish Order
            </Button>
            <Button className='bg-red-500' onClick={handleCancelOrder}>
              <CancelIcon />
              Cancel Order
            </Button>
          </div>
        </div>
      )}
      {!order && (
        <div className='flex justify-center items-center w-full h-full'>
          <h2 className='text-2xl font-bold text-center'>Empty Cart</h2>
        </div>
      )}
    </section>
  );
};
