import { ApiProperty } from '@nestjs/swagger';

export class UnAuthorizedResponseSwaggerModel {
  @ApiProperty({ example: 'Invalid API key' })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class NotFoundResponseSwaggerModel {
  @ApiProperty({ example: 'Not Found' })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}
