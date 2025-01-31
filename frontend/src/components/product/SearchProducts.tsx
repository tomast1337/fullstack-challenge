'use client';

import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

const productSearchValidation = zod.object({
  name: zod.string().nonempty(),
});

type searchFromType = zod.infer<typeof productSearchValidation>;

export const SearchProducts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<searchFromType>();

  const onSubmit = (data: searchFromType) => {
    const query = new URLSearchParams();
    query.append('query', data.name);
    query.append('page', '1');
    query.append('limit', '25');
    query.append('sort', 'createdAt');
    query.append('order', 'false');

    const url = `/product?${query.toString()}`;
    window.location.href = url;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        {errors.name ? (
          <p className='text-red-500'>Name is required</p>
        ) : (
          <div className='h-5' />
        )}
        <Input
          placeholder='Search...'
          className='rounded-lg pl-10 bg-gray-100 text-gray-800'
          {...register('name', { required: true })}
        />

        <Button
          className='bg-blue-600 hover:bg-blue-500 transition rounded-lg'
          type='submit'
        >
          <SearchIcon className='w-5 h-5' />
          Search
        </Button>
      </form>
    </>
  );
};
