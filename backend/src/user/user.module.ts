import { Module } from '@nestjs/common';
import { FileModule } from '@server/file/file.module';
import { OrdersModule } from '@server/orders/orders.module';
import { PrismaModule } from '@server/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, FileModule.forRootAsync(), OrdersModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
