import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from '@server/file/file.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { PagingDto } from '@server/dto/paging.dto';
import { User } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,

    @Inject(FileService)
    private readonly fileService: FileService,
  ) {}
  public async create(
    { name, category, description, price, stockQuantity }: CreateProductDto,
    { id }: User,
    picture: Express.Multer.File,
  ) {
    const product = await this.prismaService.product.create({
      data: {
        name,
        category,
        description,
        price,
        stockQuantity,
        picture: '/default.jpg',
        user: {
          connect: {
            id,
          },
        },
      },
    });

    try {
      const image = await this.fileService.uploadImage(
        picture.buffer,
        `product-${product.id}-${Date.now()}`,
      );
      await this.prismaService.product.update({
        where: {
          id: product.id,
        },
        data: {
          picture: image,
        },
      });
      return product;
    } catch (error) {
      await this.prismaService.product.delete({
        where: {
          id: product.id,
        },
      });
      throw new HttpException(
        {
          message: 'Error uploading image',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAll({ limit, order, page, query, sort }: PagingDto) {
    const products = await this.prismaService.product.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    });
    return products;
  }

  public async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    return product;
  }

  public async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
    picture?: Express.Multer.File,
  ) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    if (product.userId !== user.id) {
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updated = await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });

    if (picture) {
      const image = await this.fileService.uploadImage(
        picture.buffer,
        `product-${id}-${Date.now()}`,
      );
      await this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          picture: image,
        },
      });

      // delete old image
      await this.fileService.deleteImage(product.picture);

      updated.picture = image;
    }

    return updated;
  }

  public async remove(id: number, user: User) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    if (product.userId !== user.id) {
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prismaService.product.delete({
      where: {
        id,
      },
    });

    // delete image
    await this.fileService.deleteImage(product.picture);

    return {
      message: 'Product deleted',
    };
  }
}
