import { ApiProperty } from '@nestjs/swagger';

export class UserSwaggerResponseModel {
  @ApiProperty()
  id: string;
  // Add your response properties here
}
