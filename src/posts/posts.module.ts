import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SupabaseModule } from '../supabase/supabase.module';  

@Module({
  imports: [SupabaseModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
