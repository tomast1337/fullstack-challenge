'use client';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { ProductDto } from '@backend/product/dto/product.dto';
import { Button } from '@frontend/components/ui/button';
import Image from 'next/image';
import { ProductSugesstion } from './ProductSugesstion';
import { useOrder } from '@frontend/hooks/use-order';
import { useShallow } from 'zustand/react/shallow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { useToast } from '@frontend/hooks/use-toast';
import { Label } from '../ui/label';

export const ProductDetail = ({ product }: { product: ProductDto }) => {
  const { addToOrder } = useOrder(useShallow((state) => ({ ...state })));
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (product.stockQuantity < quantity) {
      toast({
        title: 'Error',
        description: 'Not enough stock',
      });
      return;
    }
    try {
      await addToOrder(product.id, quantity);
      toast({
        title: 'Success',
        description: 'Product added to cart',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again',
      });
    }
  };

  return (
    <div className='w-[90%] container mx-auto px-auto py-8 flex flex-col space-y-8 h-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Product Image */}
        <div>
          <Image
            width={500}
            height={500}
            src={product.picture}
            alt={product.name}
            className='max-w-80 max-h-80 object-cover rounded-t-lg'
          />
        </div>

        {/* Product Details */}
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-gray-600'>{product.description}</p>
          <p className='text-2xl font-semibold'>${product.price.toFixed(2)}</p>
          {product.stockQuantity > 0 ? (
            <>
              <Label>Set the quantity:</Label>
              <Select>
                {/* Select Trigger */}
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='1' />
                </SelectTrigger>
                <SelectContent>
                  {/* Select Items */}
                  {Array.from({ length: product.stockQuantity }).map(
                    (_, index) => (
                      <SelectItem
                        onClick={() => setQuantity(index + 1)}
                        key={index}
                        value={String(index + 1)}
                      >
                        {index + 1}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              {/* Add to Cart Button */}
              <Button
                className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
                onClick={handleAddToCart}
              >
                <AddShoppingCartIcon className='mr-2' />
                Add to Cart
              </Button>
            </>
          ) : (
            <p className='text-red-500'>Out of Stock</p>
          )}
        </div>
      </div>
      <span className='flex-grow' />
      <div className='flex flex-col flex-grow align-middle space-y-4 w-[90%] mx-auto'>
        <ProductSugesstion />
      </div>
    </div>
  );
};
