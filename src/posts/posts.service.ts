import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostEntity } from './entities/post.entity';
import { CreateRelatedPostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  private readonly tableName = 'posts';

  private readonly predefinedTags = [
    'Diversity & Inclusion',
    'Tech Companies',
    'Crypto',
    'Security',
    'Global',
    'Leaks',
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  async getPosts({
    tags,
    page,
    limit,
  }: {
    tags?: string;
    page: number;
    limit: number;
  }): Promise<PostEntity[]> {
    const query = this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*');

    if (tags) {
      query.contains('tags', [tags]);
    }

    const { data, error } = await query
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);
    return data as PostEntity[];
  }

  async getPostById(id: string): Promise<PostEntity> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Post with ID ${id} not found`);
    return data as PostEntity;
  }

  async getRelatedPosts(tags: string[]): Promise<PostEntity[]> {
    const formattedTags = tags.map((tag) => `"${tag.trim()}"`);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .or(formattedTags.map((tag) => `tags.cs.{${tag}}`).join(','))
      .limit(5);

    if (error) throw new Error(error.message);
    return data as PostEntity[];
  }

  private assignRandomTags(): string[] {
    const shuffledTags = this.predefinedTags.sort(() => 0.5 - Math.random());
    const numberOfTags =
      Math.floor(Math.random() * (shuffledTags.length - 1)) + 1;
    return shuffledTags.slice(0, numberOfTags);
  }

  async createRelatedPost(
    createRelatedPost: CreateRelatedPostDto,
  ): Promise<PostEntity> {
    const tags = this.assignRandomTags();
    const postWithTags = { ...createRelatedPost, tags };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .insert(postWithTags)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as PostEntity;
  }
}
