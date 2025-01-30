import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from '@server/file/file.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { PagingDto } from '@server/dto/paging.dto';
import { User } from '@prisma/client';
import { PageDto } from '@server/dto/page.dto';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
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
    this.logger.debug(`Creating product ${name} by user ${id}`);

    const product = await this.prismaService.product.create({
      data: {
        name,
        category,
        description,
        price,
        stockQuantity,
        picture: '/not-found.png',
        userId: id,
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
      return ProductDto.fromEntity(product);
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

  public async findAll({
    limit,
    order,
    page,
    query,
    sort,
  }: PagingDto): Promise<PageDto<ProductDto>> {
    const products = await this.prismaService.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order ? 'asc' : 'desc',
      },
    });
    const total = await this.prismaService.product.count({
      where: {
        name: {
          contains: query,
        },
      },
    });
    return {
      data: products.map(ProductDto.fromEntity),
      limit,
      page,
      total,
    };
  }

  public async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    return ProductDto.fromEntity(product);
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

    return ProductDto.fromEntity(updated);
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

    return ProductDto.fromEntity(product);
  }

  public async findRandomSample(limit: number) {
    const total = await this.prismaService.product.count();
    const random = Math.floor(Math.random() * (total - limit));
    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: random,
    });
    return products.map(ProductDto.fromEntity);
  }
}
