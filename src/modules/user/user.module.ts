import { Module } from '@nestjs/common';
import { UserController } from './interface/http/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './application/ports/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
