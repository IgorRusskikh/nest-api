import * as argon2 from 'argon2';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtServie: JwtService,
  ) {}

  async register(authUserDto: Prisma.UserCreateInput) {
    console.log(authUserDto);

    const passwordHash = await this.hashPassword(authUserDto.password);
    const newUser = this.userService.create({
      ...authUserDto,
      password: passwordHash,
    });
    return newUser;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtServie.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new InternalServerErrorException('Error hashing password');
    }
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch (error) {
      console.error('Error validating password:', error);
      throw new InternalServerErrorException('Error validating password');
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.getOne(username);

    if (!user) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }

    console.log(password, user.password);

    const isValidPwd = await this.validatePassword(password, user.password);

    if (!isValidPwd) {
      console.log('Invalid password');
      throw new ConflictException('Invalid password');
    }

    console.log('Validated');

    const { password: extractedPassword, ...userData } = user;
    return this.jwtServie.sign({
      username: userData.username,
      sub: userData.id,
    });
  }
}
