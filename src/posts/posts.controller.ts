import { Controller, Get, Param, Post } from '@nestjs/common';

import { PostsService } from './posts.service';
import { Prisma } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  async getAll() {
    return this.postsService.getAll();
  }

  @Get('/:slug')
  getOne(@Param('slug') slug: string) {
    return this.postsService.getOne(slug);
  }

  @Post('')
  create(@Body() postCreteDto: Prisma.PostCreateInput) {
    return;
  }
}
