import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MailingModule } from './mailing/mailing.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, ProductModule, AuthModule, OrdersModule, MailingModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
