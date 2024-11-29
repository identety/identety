import { ApiProperty } from '@nestjs/swagger';

export class RoleSwaggerResponseModel {
  @ApiProperty()
  id: string;
  // Add your response properties here
}
