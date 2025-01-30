import { ProductDto } from '@backend/product/dto/product.dto';
import ClientAxios from '@frontend/lib/axios/clientAxios';
import { create } from 'zustand';

interface ProductState {
  products: ProductDto[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: FormData) => Promise<void>;
  updateProduct: (id: number, product: FormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => {
  const fetchProducts = async () => {
    set({ loading: true, error: null });
    try {
      const response = await ClientAxios.get<ProductDto[]>('/product/my');
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching products', loading: false });
    }
  };

  const createProduct = async (product: FormData) => {
    set({ loading: true, error: null });
    try {
      const registed = await ClientAxios.post<ProductDto>('/product', product);
      set((state) => ({
        products: [...state.products, registed.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error creating product', loading: false });
    }
  };

  const updateProduct = async (id: number, product: FormData) => {
    set({ loading: true, error: null });
    try {
      await ClientAxios.patch(`/product/${id}`, product);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...product } : p,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error updating product', loading: false });
    }
  };

  const deleteProduct = async (id: number) => {
    set({ loading: true, error: null });
    try {
      await ClientAxios.delete(`/product/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error deleting product', loading: false });
    }
  };

  return {
    products: [],
    loading: false,
    error: null,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
