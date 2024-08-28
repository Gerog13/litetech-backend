import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl) throw new Error('supabaseUrl is required.');
    if (!supabaseKey) throw new Error('supabaseKey is required.');

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
