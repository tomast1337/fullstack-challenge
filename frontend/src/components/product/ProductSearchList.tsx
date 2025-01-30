'use client';
import { UseProducts, useProducts } from '@frontend/hooks/use-products';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LoadingProducts, ProductCard } from './ProductCard';
import { ProductPagination } from './ProductPagination';

export const ProductSearchList = () => {
  const searchParams = useSearchParams();

  const [page] = useState(+(searchParams.get('page') || 1));
  const [limit] = useState(+(searchParams.get('limit') || 25));
  const [query] = useState(searchParams.get('query') || '');
  const [sort] = useState(searchParams.get('sort') || 'id');
  const [order] = useState(!!searchParams.get('order') || false);

  const { fetchProducts, products, loading, total }: UseProducts = useProducts(
    useShallow((state) => state),
  );

  useEffect(() => {
    fetchProducts(page, limit, query).then(() => {
      console.log('fetchProducts');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, query, sort, order]);

  return (
    <>
      <section className='flex flex-wrap gap-4 justify-center'>
        {loading ? (
          <LoadingProducts length={limit} />
        ) : (
          <>
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        )}
        {/* Pagination Component */}
        {total > limit && (
          <ProductPagination
            current={page}
            limit={limit}
            total={total}
            query={query}
          />
        )}
      </section>
    </>
  );
};
