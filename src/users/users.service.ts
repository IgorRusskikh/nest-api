import { ConflictException, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user;
  }

  async create(authUserDto: Prisma.UserCreateInput) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: authUserDto.username }, { email: authUserDto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with the provided username or email already exists',
      );
    }

    const newUser = await this.prisma.user.create({
      data: authUserDto,
    });

    return newUser;
  }
}
