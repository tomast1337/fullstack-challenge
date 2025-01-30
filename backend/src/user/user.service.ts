import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PageDto } from '@server/dto/page.dto';
import { PagingDto } from '@server/dto/paging.dto';
import { FileService } from '@server/file/file.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { OrdersService } from '@server/orders/orders.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,

    @Inject(FileService)
    private readonly fileService: FileService,
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
  ) {}

  public async findPage({
    page,
    limit,
    query,
    sort,
    order,
  }: PagingDto): Promise<PageDto<User>> {
    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: {
          contains: query,
        },
      },
      orderBy: {
        [sort]: order ? 'asc' : 'desc',
      },
    });

    const total: number = await this.prismaService.user.count({
      where: {
        name: {
          contains: query,
        },
      },
    });

    return {
      data: users.map(UserDto.fromEntity),
      total,
      page,
      limit,
    };
  }

  public async findOne(id: number): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    return UserDto.fromEntity(user);
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return UserDto.fromEntity(user);
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return UserDto.fromEntity(updatedUser);
  }

  public async updatePicture(id: number, file: Express.Multer.File) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new HttpException(
          {
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Convert file to Buffer
      const fileBuffer = file.buffer;

      const picture = await this.fileService.uploadImage(
        fileBuffer,
        `user-${id}`,
      );
      const updatedUser = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          picture,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating picture',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createWithEmail(destination: string) {
    const user = await this.prismaService.user.create({
      data: {
        email: destination,
        name: destination.split('@')[0],
        picture: '/img/default-pfp.png',
      },
    });

    this.ordersService.createNew(
      {
        orderItems: [],
        status: 'PENDING',
      },
      user,
    );

    return user;
  }

  public async remove(id: number) {
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    return UserDto.fromEntity(deletedUser);
  }
}
