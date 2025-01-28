import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PagingDto } from '@server/dto/paging.dto';
import { PrismaService } from '@server/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService } from '@server/file/file.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,

    @Inject(FileService)
    private readonly fileService: FileService,
  ) {}
  public async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  public async findPage({ page, limit, query, sort, order }: PagingDto) {
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
    return users;
  }

  public async findOne(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return updatedUser;
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
        picture: 'https://example.com/picture.jpg',
      },
    });
    return user;
  }

  public async remove(id: number) {
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    return deletedUser;
  }
}
