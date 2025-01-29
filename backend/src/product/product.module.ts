import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileModule } from '@server/file/file.module';
import { PrismaModule } from '@server/prisma/prisma.module';

@Module({
  imports: [FileModule.forRootAsync(), PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
