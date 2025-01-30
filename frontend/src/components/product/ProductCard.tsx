'use client';
import { ProductDto } from '@backend/product/dto/product.dto';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Skeleton } from '@frontend/components/ui/skeleton';
import InfoIcon from '@mui/icons-material/Info';
import { Button } from '@frontend/components/ui/button';
import { useRouter } from 'next/navigation';
export const ProductCardSkeleton = () => (
  <Card className='w-[300px] max-w-sm'>
    {/* Skeleton for Product Image */}
    <Skeleton className='w-full h-48 rounded-t-lg' />

    {/* Skeleton for Card Header (Product Name and Description) */}
    <CardHeader>
      <CardTitle>
        <Skeleton className='w-3/4 h-6' />
      </CardTitle>
      <CardDescription>
        <Skeleton className='w-full h-4 mt-2' />
        <Skeleton className='w-2/3 h-4 mt-2' />
      </CardDescription>
    </CardHeader>

    {/* Skeleton for Card Content (Product Price) */}
    <CardContent>
      <Skeleton className='w-1/4 h-6' />
    </CardContent>

    {/* Skeleton for Card Footer (Add to Cart Button) */}
    <CardFooter>
      <Skeleton className='w-full h-10 rounded-lg' />
    </CardFooter>
  </Card>
);
export const LoadingProducts = ({ length }: { length: number }) => {
  return (
    <>
      {[...Array(length)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
};
export const ProductCard = ({ product }: { product: ProductDto }) => {
  const { description, name, picture, price } = product;
  const router = useRouter();

  const onProductClick = () => {
    router.push(`/product/${product.id}`);
  };
  return (
    <Card className='w-[300px] max-w-sm h-[500px] flex flex-col'>
      {/* Card Header: Product Image and Name */}
      <CardHeader>
        <Image
          src={picture}
          alt={name}
          width={300}
          height={200}
          className='w-full h-48 object-cover rounded-t-lg'
        />
        <CardTitle className='mt-4'>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {/* Card Content: Product Price */}
      <CardContent>
        <p className='text-lg font-semibold'>${price.toFixed(2)}</p>
      </CardContent>

      <span className='flex-grow' />
      {/* Card Footer: See Product Button */}
      <CardFooter>
        {product.stockQuantity > 0 ? (
          <Button
            onClick={onProductClick}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
          >
            <InfoIcon className='mr-2' />
            See Product
          </Button>
        ) : (
          <Button
            className='w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors'
            disabled
          >
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
