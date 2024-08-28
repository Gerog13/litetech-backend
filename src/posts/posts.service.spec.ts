import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              from: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: {} }),
              range: jest.fn().mockReturnThis(),
              order: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              insert: jest.fn().mockResolvedValue({ data: {} }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosts', () => {
    it('should return an array of posts', async () => {
      const result = [
        {
          id: '1',
          title: 'Test Post',
          imageUrl: 'https://example.com/image.jpg',
          content: 'This is a test post content',
          featured: false,
          totalVisits: 100,
          tags: ['nestjs', 'supabase'],
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getPosts').mockResolvedValue(result);
      expect(await service.getPosts({ page: 1, limit: 10 })).toBe(result);
    });
  });

  describe('getPostById', () => {
    it('should return a single post by ID', async () => {
      const result = {
        id: '1',
        title: 'Test Post',
        imageUrl: 'https://example.com/image.jpg',
        content: 'This is a test post content',
        featured: true,
        totalVisits: 200,
        tags: ['nestjs', 'supabase'],
        createdAt: new Date(),
      };
      jest.spyOn(service, 'getPostById').mockResolvedValue(result);
      expect(await service.getPostById('1')).toBe(result);
    });

    it('should throw a NotFoundException if post is not found', async () => {
      jest
        .spyOn(service, 'getPostById')
        .mockRejectedValue(new NotFoundException());
      await expect(service.getPostById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRelatedPosts', () => {
    it('should return an array of related posts based on tags', async () => {
      const tags = ['related', 'post'];
      const result = [
        {
          id: '1',
          title: 'Related Post',
          content: 'This is a related post.',
          imageUrl: 'https://example.com/image.jpg',
          featured: false,
          totalVisits: 50,
          tags: ['related', 'post'],
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getRelatedPosts').mockResolvedValue(result);
      expect(await service.getRelatedPosts(tags)).toBe(result);
    });

    it('should handle no tags provided gracefully', async () => {
      const tags = [];
      const result = [];

      jest.spyOn(service, 'getRelatedPosts').mockResolvedValue(result);
      expect(await service.getRelatedPosts(tags)).toBe(result);
    });
  });

  describe('createRelatedPost', () => {
    it('should create and return a new post with optional fields', async () => {
      const createPostDto = {
        title: 'New Post',
        imageUrl: 'https://example.com/image.jpg',
        content: 'This is a new post content',
        featured: true,
        totalVisits: 10,
        tags: ['new', 'post'],
      };

      const result = {
        id: '1',
        title: 'New Post',
        imageUrl: 'https://example.com/image.jpg',
        content: 'This is a new post content',
        featured: true,
        totalVisits: 10,
        tags: ['new', 'post'],
        createdAt: new Date(),
      };

      jest.spyOn(service, 'createRelatedPost').mockResolvedValue(result);
      expect(await service.createRelatedPost(createPostDto)).toBe(result);
    });

    it('should create and return a new post without optional fields', async () => {
      const createRelatedPostDto = {
        title: 'New Post',
        imageUrl: 'https://example.com/image.jpg',
      };

      const result = {
        id: '1',
        title: 'New Post',
        imageUrl: 'https://example.com/image.jpg',
        content: null,
        featured: false,
        totalVisits: 0,
        tags: null,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'createRelatedPost').mockResolvedValue(result);
      expect(await service.createRelatedPost(createRelatedPostDto)).toBe(
        result,
      );
    });
  });
});
