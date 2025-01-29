import { Product } from '@prisma/client';

export class ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  static fromEntity(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      picture: product.picture,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
