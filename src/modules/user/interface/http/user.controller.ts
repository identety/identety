import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserListQueryDto,
} from './dtos/user.dto';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';
import { ApiSecurity } from '@nestjs/swagger';
import { UserResponseSwagger } from '@/modules/user/interface/http/dtos/user-response.swagger';
import { BaseHTTPController } from '@/shared/interface/http/baseHTTPController';

@Controller('users')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class UserController extends BaseHTTPController {
  constructor(private readonly service: UserService) {
    super();
  }

  @Post()
  @UserResponseSwagger.CreateClient()
  async createUser(@Body() body: CreateUserDto) {
    return this.execute(() => this.service.createUser(body));
  }

  @Get()
  @UserResponseSwagger.GetUserList()
  async getUsers(@Query() query: UserListQueryDto) {
    return this.execute(() => this.service.getUsersWithPagination(query));
  }

  @Get(':id')
  @UserResponseSwagger.GetClientById()
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.execute(async () => {
      const user = await this.service.findById(userId);
      delete user['password_hash'];
      return user;
    });
  }

  @Put(':id')
  @UserResponseSwagger.UpdateClient()
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.execute(() => this.service.updateUser(id, body));
  }

  @Delete(':id')
  @UserResponseSwagger.DeleteClient()
  async deleteUser(@Param('id') id: string) {
    return this.execute(() => this.service.deleteUser(id));
  }
}
