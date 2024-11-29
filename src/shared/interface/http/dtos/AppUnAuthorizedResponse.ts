import { ApiProperty } from '@nestjs/swagger';

export class AppUnAuthorizedResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}
