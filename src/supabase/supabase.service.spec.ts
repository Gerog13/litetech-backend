import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SupabaseService, ConfigService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
