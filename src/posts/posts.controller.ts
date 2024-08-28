import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateRelatedPostDto } from './dto/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of posts with optional filtering by tags and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully.',
  })
  async getPosts(
    @Query('tags') tags?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PostEntity[]> {
    return this.postsService.getPosts({ tags, page, limit });
  }

  @Get('related')
  @ApiOperation({ summary: 'Get related posts by multiple tags' })
  @ApiResponse({
    status: 200,
    description: 'Related posts retrieved successfully.',
  })
  async getRelatedPosts(@Query('tags') tags: string): Promise<PostEntity[]> {
    if (!tags) {
      throw new Error('Tags query parameter is required');
    }
    const tagsArray = tags.split(',');
    return this.postsService.getRelatedPosts(tagsArray);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post('related')
  @UsePipes(new ValidationPipe({ transform: true }))
  createRelatedPost(@Body() createRelatedPostDto: CreateRelatedPostDto) {
    return this.postsService.createRelatedPost(createRelatedPostDto);
  }
}
