import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';
import process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    PersistenceModule,
  ],
  exports: [ConfigModule, PersistenceModule],
})
export class TestHelperModule {}
