import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { PersistentDriverService } from './persistent-driver.service';
import { DrizzleService } from '@/shared/infrastructure/persistence/drizzle/drizzle.service';

@Module({
  imports: [DrizzleModule],
  exports: [DrizzleService, PersistentDriverService],
  providers: [PersistentDriverService],
})
export class PersistenceModule {}
