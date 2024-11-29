import { ApiProperty } from '@nestjs/swagger';

export class OauthSwaggerResponseModel {
  @ApiProperty()
  id: string;
  // Add your response properties here
}
