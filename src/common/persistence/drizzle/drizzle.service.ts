import { Injectable, OnModuleInit } from '@nestjs/common';
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

  async onModuleInit() {
    console.log('DrizzleService.onModuleInit');
    this.drizzle = this.init();
  }

  init() {
    return drizzle('postgresql://rayhan:rayhan123@localhost:5432/ostasks', {
      schema,
      logger: true,
    });
  }
}
