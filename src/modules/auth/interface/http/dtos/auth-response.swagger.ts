import { ApiProperty } from '@nestjs/swagger';

export class AuthSwaggerResponseModel {
  @ApiProperty()
  id: string;
  // Add your response properties here
}
