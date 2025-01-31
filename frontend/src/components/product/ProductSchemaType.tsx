'use client';
import { Input } from '@frontend/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { Button } from '../ui/button';

const validationSchema = zod.object({
  name: zod.string().nonempty('Name is required'),
  price: zod.number().positive('Price must be a positive number'),
  category: zod.string().nonempty('Category is required'),
  description: zod.string().nonempty('Description is required'),
  stockQuantity: zod
    .number()
    .positive('Stock quantity must be a positive number'),
  id: zod.string().optional(),
  image: zod.string().optional(),
});
export type ProductSchemaType = zod.infer<typeof validationSchema>;
export const ProductForm = ({
  product,
  onSubmit,
}: {
  product?: ProductSchemaType;
  onSubmit: (data: ProductSchemaType) => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (product) {
      Object.keys(product).forEach((key) => {
        setValue(
          key as keyof ProductSchemaType,
          product[key as keyof ProductSchemaType],
        );
      });
    }
  }, [product, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Label htmlFor='name' className='text-sm text-gray-300'>
        Name
      </Label>
      <Input
        id='name'
        placeholder='Enter product name'
        className='rounded-lg'
        {...register('name')}
      />
      {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
      <Label htmlFor='price' className='text-sm text-gray-300'>
        Price
      </Label>
      <Input
        id='price'
        placeholder='Enter product price'
        className='rounded-lg'
        {...register('price')}
      />
      {errors.price && <p className='text-red-500'>{errors.price.message}</p>}
      <Label htmlFor='category' className='text-sm text-gray-300'>
        Category
      </Label>
      <Input
        id='category'
        placeholder='Enter product category'
        className='rounded-lg'
        {...register('category')}
      />
      {errors.category && (
        <p className='text-red-500'>{errors.category.message}</p>
      )}
      <Label htmlFor='description' className='text-sm text-gray-300'>
        Description
      </Label>
      <Input
        id='description'
        placeholder='Enter product description'
        className='rounded-lg'
        {...register('description')}
      />
      {errors.description && (
        <p className='text-red-500'>{errors.description.message}</p>
      )}
      <Label htmlFor='stockQuantity' className='text-sm text-gray-300'>
        Stock Quantity
      </Label>
      <Input
        id='stockQuantity'
        placeholder='Enter product stock quantity'
        className='rounded-lg'
        {...register('stockQuantity')}
      />
      {errors.stockQuantity && (
        <p className='text-red-500'>{errors.stockQuantity.message}</p>
      )}
      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-500 transition rounded-lg flex items-center gap-2'
      >
        Save
      </Button>
    </form>
  );
};
