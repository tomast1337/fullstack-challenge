'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@frontend/components/ui/dialog';
import { useToast } from '@frontend/hooks/use-toast';
import { ProductForm, ProductSchemaType } from './ProductForm';

export const EditProductModal = ({
  onEdit,
  product = {
    name: '',
    price: 0,
    category: '',
    description: '',
    stockQuantity: 0,
  },
  isOpen,
  onClose,
}: {
  onEdit: (data: ProductSchemaType) => void;
  product?: ProductSchemaType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();

  const handleEdit = async (data: ProductSchemaType) => {
    try {
      await onEdit(data);
      toast({
        title: 'Product updated',
        description: 'Product has been updated successfully',
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
          <DialogTitle>Editing Product {product.name}</DialogTitle>
          <DialogDescription>
            Fill in the form below to edit the product
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={product} onSubmit={handleEdit} />
      </DialogContent>
    </Dialog>
  );
};
