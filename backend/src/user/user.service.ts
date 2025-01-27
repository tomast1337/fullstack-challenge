import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@server/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}
  public async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  public async findPage() {
    return `This action returns all user`;
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
    return `This action updates a #${id} user`;
  }

  public async createWithEmail(destination: string) {
    const user = await this.prismaService.user.create({
      data: {
        email: destination,
        name: 'New User',
        picture: 'https://example.com/picture.jpg',
      },
    });
    return user;
  }

  public async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
