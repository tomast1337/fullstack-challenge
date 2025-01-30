'use client';
import { OrderDto } from '@backend/orders/dto/order.dto';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@frontend/components/ui/table';
import { useOrder } from '@frontend/hooks/use-order';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import PendingIcon from '@mui/icons-material/Pending';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const MyOrders = () => {
  type OrderStatus = OrderDto['status'];

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <DoneIcon />;
      case 'CANCELED':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const { oldOrders, retrieveOldOrders } = useOrder(
    useShallow((state) => ({
      ...state,
    })),
  );

  useEffect(() => {
    retrieveOldOrders();
  }, [retrieveOldOrders]);

  return (
    <section className='container mx-auto p-4 w-[900px]'>
      <h1 className='text-2xl font-bold mb-4'>My Orders</h1>

      {oldOrders && (
        <div className='flex justify-center items-center flex-col w-full'>
          <div className='overflow-x-auto max-w-[900px] w-full'>
            <Table className='min-w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead className='py-2 px-4 border-b'>status</TableHead>
                  <TableHead className='py-2 px-4 border-b'>
                    Last Update
                  </TableHead>
                  <TableHead className='py-2 px-4 border-b'>
                    Order Items
                  </TableHead>
                  <TableHead className='py-2 px-4 border-b'>
                    Total Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oldOrders.map(({ updatedAt, id, status, orderItems }) => (
                  <TableRow key={id}>
                    <TableCell>
                      {' '}
                      {status} {getOrderStatusIcon(status)}
                    </TableCell>
                    <TableCell>
                      {new Date(updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {orderItems.map(({ name, quantity }, i) => (
                        <div key={i} className='flex flex-col'>
                          <span className='capitalize font-semibold'>
                            {name}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {quantity}
                          </span>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      ${' '}
                      {orderItems
                        .reduce(
                          (acc, { price, quantity }) => acc + price * quantity,
                          0,
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </section>
  );
};
