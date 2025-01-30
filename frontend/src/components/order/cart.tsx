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
  const { order, fetchOrder, removeFormOrder, completeOrder, cancelOrder } =
    useOrder(
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

  const getOrderTotalPrice = () => {
    if (!order) {
      return 0;
    }
    return order.orderItems.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0,
    );
  };

  const getOrderTotalQuantity = () => {
    if (!order) {
      return 0;
    }
    return order.orderItems.reduce((acc, { quantity }) => acc + quantity, 0);
  };

  return (
    <section className='container mx-auto p-4 w-[900px]'>
      <h1 className='text-2xl font-bold mb-4'>Cart</h1>
      {order && (
        <div className='flex justify-center items-center flex-col w-full'>
          <div className='overflow-x-auto max-w-[600px] w-full'>
            <Table className='min-w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead className='py-2 px-4 border-b'>Name</TableHead>
                  <TableHead className='py-2 px-4 border-b'>
                    Individual price
                  </TableHead>
                  <TableHead className='py-2 px-4 border-b'>Quantity</TableHead>
                  <TableHead className='py-2 px-4 border-b'>
                    Total price
                  </TableHead>
                  <TableHead className='py-2 px-4 border-b'>Remove</TableHead>
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
                        <Button onClick={() => removeFormOrder(productId)}>
                          <DeleteIcon />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
                {order.orderItems.length < 20 &&
                  order.orderItems.length > 0 &&
                  Array.from({ length: 20 - order.orderItems.length }).map(
                    (_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className='block w-8' />
                        </TableCell>
                        <TableCell>
                          <span className='w-6' />
                        </TableCell>
                        <TableCell>
                          <span className='w-6' />
                        </TableCell>
                        <TableCell>
                          <span className='w-6' />
                        </TableCell>
                        <TableCell>
                          <span className='w-6' />
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                {order.orderItems.length === 0 &&
                  Array.from({ length: 20 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className='block w-8' />
                      </TableCell>
                      <TableCell>
                        <span className='w-6' />
                      </TableCell>
                      <TableCell>
                        <span className='w-6' />
                      </TableCell>
                      <TableCell>
                        <span className='w-6' />
                      </TableCell>
                      <TableCell>
                        <span className='w-6' />
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell className='py-2 px-4 border-b'>Total</TableCell>
                  <TableCell className='py-2 px-4 border-b' />
                  <TableCell className='py-2 px-4 border-b'>
                    {getOrderTotalQuantity()}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {`$ ${getOrderTotalPrice().toFixed(2)}`}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b' />
                </TableRow>
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
