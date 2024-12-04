import { Module } from '@nestjs/common';
import { PersistentDriverService } from './persistent-driver.service';

@Module({
  exports: [PersistentDriverService],
  providers: [PersistentDriverService],
})
export class PersistenceModule {}
