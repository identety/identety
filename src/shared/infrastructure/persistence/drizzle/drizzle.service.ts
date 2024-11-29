import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

@Injectable()
export class DrizzleService implements OnModuleInit {
  drizzle: NodePgDatabase<typeof schema> & {
    $client: NodePgClient;
  };

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    console.log('DrizzleService.onModuleInit');
    this.drizzle = this.init();
  }

  init() {
    return drizzle(this.config.get('DATABASE_URL'), {
      schema,
      logger: true,
    });
  }
}
