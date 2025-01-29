'use client';
import { ProductSugesstion } from './ProductSugesstion';

export const ProductNotFound = () => {
  return (
    <div className='container mx-auto p-4 text-center'>
      {/* Error Message */}
      <div className='text-2xl font-bold text-red-600 mb-8'>
        Product Not Found
      </div>

      {/* Suggestion Section */}
      <div className='text-lg font-semibold mb-4'>
        Here are some suggestions you might like:
      </div>

      {/* Product Suggestions */}
      <div className='flex flex-col space-y-4 w-[90%] mx-auto'>
        <ProductSugesstion />
      </div>
    </div>
  );
};
