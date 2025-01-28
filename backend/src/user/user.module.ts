import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@server/prisma/prisma.module';
import { FileModule } from '@server/file/file.module';

@Module({
  imports: [PrismaModule, FileModule.forRootAsync()],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
