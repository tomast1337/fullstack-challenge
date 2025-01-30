import { OrderDto } from '@backend/orders/dto/order.dto';
import ClientAxios from '@frontend/lib/axios/clientAxios';
import { create } from 'zustand';

const fetchCurrentOrder = async () => {
  const respose = await ClientAxios.get<OrderDto>('/orders/my');
  return respose.data;
};

const fetchCompleteOrder = async () => {
  await ClientAxios.patch('/orders/my', { status: 'COMPLETED' });
};
const fetchCancelOrder = async () => {
  await ClientAxios.patch('/orders/my', { status: 'CANCELED' });
};

const fetchAddToOrder = async (productId: number, quantity: number) => {
  await ClientAxios.patch('/orders/my/order-items', {
    id: productId,
    quantity,
  });
};

const fetchRemoveFromOrder = async (productId: number) => {
  await ClientAxios.delete(`/orders/my/order-items/${productId}`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchMyOrders = async () => {
  const response = await ClientAxios.get<OrderDto[]>('/orders');
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchOrderById = async (id: string) => {
  const response = await ClientAxios.get(`/orders/${id}`);
  return response.data;
};

type UseOrders = {
  // Current order
  fetchOrder: VoidFunction;
  completeOrder: VoidFunction;
  cancelOrder: VoidFunction;
  addToOrder: (productId: number, quantity: number) => Promise<void>;
  removeFormOrder: (productId: number) => Promise<void>;
  order: OrderDto | null;
  // Old orders
  oldOrders: OrderDto[] | null;
  retrieveOldOrders: VoidFunction;
};

export const useOrder = create<UseOrders>((set) => {
  const fetchOrder = async () => {
    const order = await fetchCurrentOrder();
    set({ order });
  };
  const completeOrder = async () => {
    await fetchCompleteOrder();
    await fetchOrder();
  };
  const cancelOrder = async () => {
    await fetchCancelOrder();
    await fetchOrder();
  };

  const addToOrder = async (productId: number, quantity: number) => {
    await fetchAddToOrder(productId, quantity);
    await fetchOrder();
  };

  const removeFormOrder = async (productId: number) => {
    await fetchRemoveFromOrder(productId);
    await fetchOrder();
  };

  const fetchOldOrders = async () => {
    const oldOrders = await fetchMyOrders();
    set({ oldOrders });
  };

  return {
    fetchOrder,
    completeOrder,
    cancelOrder,
    addToOrder,
    removeFormOrder,
    order: null,

    oldOrders: null,
    retrieveOldOrders: fetchOldOrders,
  };
});
