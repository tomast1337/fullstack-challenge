'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@frontend/components/ui/dialog';
import { useToast } from '@frontend/hooks/use-toast';
import { ProductForm, ProductSchemaType } from './ProductSchemaType';

export const AddProductModal = ({
  isOpen,
  onClose,
  onAdd,
  product = {
    name: '',
    price: 0,
    category: '',
    description: '',
    stockQuantity: 0,
  },
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ProductSchemaType) => void;
  product?: ProductSchemaType;
}) => {
  const { toast } = useToast();

  const handleAdd = async (data: ProductSchemaType) => {
    try {
      await onAdd(data);
      onClose();
      toast({
        title: 'Product added',
        description: 'Product has been added successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new product
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={product} onSubmit={handleAdd} />
      </DialogContent>
    </Dialog>
  );
};
