import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.post.findMany();
  }

  async getOne(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (!post) throw new NotFoundException();

    return post;
  }

  async create(createPostDto: Prisma.PostCreateInput) {
    const existingPost = await this.prisma.post.findUnique({
      where: {
        slug: createPostDto.slug,
      },
    });

    if (!existingPost) throw new ConflictException();

    const newPost = await this.prisma.post.create({
      data: createPostDto,
    });

    return newPost;
  }
}
