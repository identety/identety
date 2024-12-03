import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

export const TEST_ENV = {
  // DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  JWT_SECRET: 'test-secret',
  API_KEY: 'test-api-key',
  NODE_ENV: 'test',
  PORT: 3000,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => TEST_ENV] }),
    PersistenceModule,
  ],
  exports: [ConfigModule, PersistenceModule],
})
export class TestHelperModule {}
