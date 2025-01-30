import { ProductDto } from '@backend/product/dto/product.dto';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@frontend/components/ui/carousel';
import { useEffect, useState } from 'react';
import { fetchProductSample } from '@frontend/hooks/use-products';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

export const ProductSugesstion = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const size = 5;
  useEffect(() => {
    fetchProductSample().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);
  return (
    <Carousel>
      <CarouselContent>
        {loading
          ? [...Array(size)].map((_, index) => (
              <CarouselItem className='basis-1/3' key={index}>
                <ProductCardSkeleton key={index} />
              </CarouselItem>
            ))
          : products.map((product) => (
              <CarouselItem className='basis-1/3' key={product.id}>
                <ProductCard product={product} />
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
