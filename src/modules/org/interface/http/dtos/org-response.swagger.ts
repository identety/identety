import { ApiProperty } from '@nestjs/swagger';

export class OrgSwaggerResponseModel {
  @ApiProperty()
  id: string;
  // Add your response properties here
}
