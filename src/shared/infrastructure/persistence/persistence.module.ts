import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { PersistentDriverService } from './persistent-driver.service';

@Module({
  imports: [DrizzleModule],
  exports: [DrizzleModule, PersistentDriverService],
  providers: [PersistentDriverService],
})
export class PersistenceModule {}
