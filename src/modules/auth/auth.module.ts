import { Module } from '@nestjs/common';
import { AuthController } from './interface/http/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthRepository } from './application/ports/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
