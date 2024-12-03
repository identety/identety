import { Module } from '@nestjs/common';
import { UserController } from './interface/http/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './application/ports/user.repository';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
