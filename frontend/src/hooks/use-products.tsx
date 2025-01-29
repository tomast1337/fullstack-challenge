import { create } from 'zustand';
import ClientAxios from '@frontend/lib/axios/clientAxios';
import { ProductDto } from '@backend/product/dto/product.dto';
import { PageDto } from '@backend/dto/page.dto';

export type UseProducts = {
  products: null | Array<ProductDto>;
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  query: string;
  fetchProducts: (page: number, limit: number, query: string) => Promise<void>;
};

export const fetchProductPage = async (
  page: number,
  limit: number,
  query: string,
): Promise<PageDto<ProductDto>> => {
  const resposed = await ClientAxios.get<PageDto<ProductDto>>('/product', {
    params: {
      page,
      limit,
      query,
      sort: 'createdAt',
    },
  });
  return resposed.data;
};

export const fetchProduct = async (id: string): Promise<ProductDto> => {
  const respose = await ClientAxios.get<ProductDto>(`/product/${id}`);
  return respose.data;
};

export const fetchProductSample = async (): Promise<ProductDto[]> => {
  const respose = await ClientAxios.get<ProductDto[]>('/product/sample');
  return respose.data;
};

export const useProducts = create<UseProducts>((set) => {
  return {
    fetchProducts: async (page: number, limit: number, query: string) => {
      set({ loading: true, page, limit, query });
      const respose = await fetchProductPage(page, limit, query);

      set({
        products: respose.data,
        total: respose.total,
        loading: false,
      });
    },
    products: null,
    loading: true,
    total: 0,
    page: 1,
    limit: 50,
    query: '',
  };
});
