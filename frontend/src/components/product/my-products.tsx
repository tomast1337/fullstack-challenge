'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@frontend/components/ui/table';
import { useProductStore } from '@frontend/hooks/use-product-store';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '../ui/button';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { ProductSchemaType } from './ProductSchemaType';
import { useRouter } from 'next/navigation';
import { useToast } from '@frontend/hooks/use-toast';

export const MyProducts = () => {
  const { toast } = useToast();

  const {
    products,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
  } = useProductStore(useShallow((state) => ({ ...state })));

  const router = useRouter();

  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSchemaType>({
    category: '',
    description: '',
    name: '',
    price: 0,
    stockQuantity: 0,
    id: '',
    image: '',
  });

  const handleEdit = (data: ProductSchemaType) => {
    setEditProductModalOpen(false);
    setSelectedProduct(data);
  };

  const onAdd = async (data: ProductSchemaType) => {
    try {
      const fromData = new FormData();
      fromData.append('name', data.name);
      fromData.append('price', String(data.price));
      fromData.append('category', data.category);
      fromData.append('description', data.description);
      fromData.append('stockQuantity', String(data.stockQuantity));
      //fromData.append('image', data.image);
      await createProduct(fromData);
      toast({
        description: 'Product has been added successfully',
        title: 'Product added',
      });
    } catch {
      toast({
        description: 'An error occurred. Please try again',
        title: 'Error',
      });
    }
  };
  const onEdit = async (data: ProductSchemaType) => {
    try {
      const fromData = new FormData();
      fromData.append('name', data.name);
      fromData.append('price', String(data.price));
      fromData.append('category', data.category);
      fromData.append('description', data.description);
      fromData.append('stockQuantity', String(data.stockQuantity));
      //fromData.append('image', data.image);
      await updateProduct(+data.id!, fromData);
      toast({
        description: 'Product has been updated successfully',
        title: 'Product updated',
      });
    } catch {
      toast({
        description: 'An error occurred. Please try again',
        title: 'Error',
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteProduct(+id);
      toast({
        description: 'Product has been deleted successfully',
        title: 'Product deleted',
      });
    } catch {
      toast({
        description: 'An error occurred. Please try again',
        title: 'Error',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className='container mx-auto p-4 w-[900px]'>
      <h1 className='text-2xl font-bold mb-4'>My Products</h1>
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={(): void => {
          setAddProductModalOpen(false);
        }}
        onAdd={onAdd}
      />
      <EditProductModal
        onEdit={onEdit}
        product={selectedProduct}
        isOpen={isEditProductModalOpen}
        onClose={function (): void {
          setEditProductModalOpen(false);
        }}
      />

      <div className='flex justify-end items-center w-full'>
        <Button
          className='bg-blue-500'
          onClick={(): void => setAddProductModalOpen(true)}
        >
          <AddIcon />
          Add Product
        </Button>
      </div>

      <div className='flex justify-center items-center flex-col w-full'>
        <div className='overflow-x-auto max-w-[900px] w-full'>
          <Table className='min-w-full min-h-[900px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='py-2 px-4 border-b'>Name</TableHead>
                <TableHead className='py-2 px-4 border-b'>Pice</TableHead>
                <TableHead className='py-2 px-4 border-b'>Category</TableHead>
                <TableHead className='py-2 px-4 border-b'>
                  Description
                </TableHead>
                <TableHead className='py-2 px-4 border-b'>price</TableHead>
                <TableHead className='py-2 px-4 border-b'>
                  Stock Quantity
                </TableHead>
                <TableHead className='py-2 px-4 border-b'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.name}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.price}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.category}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.description}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.price}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    {product.stockQuantity}
                  </TableCell>
                  <TableCell className='py-2 px-4 border-b'>
                    <Button
                      className='mr-2 bg-blue-500'
                      onClick={() => {
                        handleEdit({
                          id: String(product.id),
                          name: product.name,
                          price: product.price,
                          category: product.category,
                          description: product.description,
                          stockQuantity: product.stockQuantity,
                          image: '',
                        });
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      className='mr-2 bg-red-500'
                      onClick={() => onDelete(String(product.id))}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      className='mr-2 bg-green-500'
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <VisibilityIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};
