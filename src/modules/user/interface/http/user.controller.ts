import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from './dtos/user.dto';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('user')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    try {
      return this.service.createUser(body);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // @Get()
  // async getUser() {}
  //
  // @Get(':id')
  // async getUserById(@Param('id') id: string) {}
  //
  // @Put(':id')
  // async updateUser(@Param('id') id: string) {}
  //
  // @Delete(':id')
  // async deleteUser(@Param('id') id: string) {}
}
