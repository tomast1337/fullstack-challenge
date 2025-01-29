import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '@prisma/client';
import { GetRequestToken } from '@server/GetRequestUser';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PagingDto } from '@server/dto/paging.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageDto } from '@server/dto/page.dto';
import { ProductDto } from './dto/product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a product',
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @GetRequestToken() user: User | null,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!user) {
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.productService.create(createProductDto, user, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a page of products',
  })
  findAll(@Query() query: PagingDto): Promise<PageDto<ProductDto>> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a product by ID',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a user's product by ID",
  })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @GetRequestToken() user: User | null,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (!user) {
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.productService.update(+id, updateProductDto, user, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user product by ID',
  })
  remove(@GetRequestToken() user: User | null, @Param('id') id: string) {
    if (!user) {
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.productService.remove(+id, user);
  }
}
