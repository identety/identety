import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { RoleService } from '../../application/services/role.service';
import { RoleResponseSwagger } from './dtos/role-response.swagger';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';
import {
  CreateRoleDto,
  RoleListQueryDto,
  UpdateRoleDto,
} from './dtos/role.dto';
import { BaseHTTPController } from '@/shared/interface/http/baseHTTPController';

@Controller('roles')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class RoleController extends BaseHTTPController {
  constructor(private readonly service: RoleService) {
    super();
  }

  @Get()
  @RoleResponseSwagger.GetRoleList()
  getRoles(@Query() query: RoleListQueryDto) {
    return this.execute(() => this.service.getRolesWithPagination(query));
  }

  @Get(':id')
  @RoleResponseSwagger.GetRoleById()
  getRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.execute(() => this.service.findById(id));
  }

  @Post()
  @RoleResponseSwagger.CreateRole()
  createRole(@Body() payload: CreateRoleDto) {
    return this.execute(() => this.service.createRole(payload));
  }

  @Patch(':id')
  @RoleResponseSwagger.UpdateRole()
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.execute(() => this.service.updateRole(id, payload));
  }

  @Delete(':id')
  @RoleResponseSwagger.DeleteRole()
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.execute(() => this.service.deleteRole(id));
  }
}
