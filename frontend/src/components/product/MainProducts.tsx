'use client';
import { UseProducts, useProducts } from '@frontend/hooks/use-products';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@frontend/components/ui/pagination';
import { LoadingProducts, ProductCard } from './LoadingProducts';

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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};
