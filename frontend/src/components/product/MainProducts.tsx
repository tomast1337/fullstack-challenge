'use client';
import { UseProducts, useProducts } from '@frontend/hooks/use-products';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LoadingProducts, ProductCard } from './ProductCard';
import { ProductPagination } from './ProductPagination';

export const MainProducts = () => {
  const {
    fetchProducts,
    products,
    loading,
    total,
    page,
    limit,
    query,
  }: UseProducts = useProducts(useShallow((state) => state));

  const pageSize = 25;

  useEffect(() => {
    fetchProducts(1, pageSize, '');
  }, [page, limit, query, fetchProducts]);

  return (
    <section className='flex flex-wrap gap-4 justify-center'>
      {loading ? (
        <LoadingProducts length={pageSize} />
      ) : (
        <>
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </>
      )}
      {/* Pagination Component */}
      {total > pageSize && (
        <ProductPagination
          current={page}
          limit={pageSize}
          total={total}
          query=''
        />
      )}
    </section>
  );
};
