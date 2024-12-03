import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule],
  exports: [ConfigModule, PersistenceModule],
})
export class TestHelperModule {}
