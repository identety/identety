import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UserListQueryDto } from './dtos/user.dto';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('users')
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

  @Get()
  async getUsers(@Query() query: UserListQueryDto) {
    return await this.service.getUsersWithPagination(query);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    const user = await this.service.findById(userId);
    delete user['password_hash'];
    return user;
  }

  // @Put(':id')
  // async updateUser(@Param('id') id: string) {}
  //
  // @Delete(':id')
  // async deleteUser(@Param('id') id: string) {}
}
