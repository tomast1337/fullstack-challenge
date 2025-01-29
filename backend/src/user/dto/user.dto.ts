import { User } from '@prisma/client';

export class UserDto {
  id: number;
  email: string;
  name: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  static fromEntity(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
