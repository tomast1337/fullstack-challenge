'use client';
import { ProductDto } from '@backend/product/dto/product.dto';
import { Button } from '@frontend/components/ui/button';
import Image from 'next/image';
import { ProductSugesstion } from './ProductSugesstion';

export const ProductDetail = ({ product }: { product: ProductDto }) => {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Product Image */}
        <div>
          <Image
            width={500}
            height={500}
            src={product.picture}
            alt={product.name}
            className='w-full h-auto rounded-lg'
          />
        </div>

        {/* Product Details */}
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-gray-600'>{product.description}</p>
          <p className='text-2xl font-semibold'>${product.price.toFixed(2)}</p>

          {/* Add to Cart Button */}
          <Button className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'>
            Add to Cart
          </Button>
        </div>
      </div>
      <div className='mt-8' />
      <div className='flex flex-col space-y-4 w-[90%] mx-auto'>
        <ProductSugesstion />
      </div>
    </div>
  );
};
