import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserAddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsOptional()
  locality?: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  givenName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  familyName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ example: 'en-US' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiProperty({ type: UserAddressDto })
  @IsOptional()
  @IsObject()
  @Type(() => UserAddressDto)
  address?: UserAddressDto;

  @ApiProperty({ example: { customField: 'value' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  givenName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  familyName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ example: 'en-US' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiProperty({ type: UserAddressDto })
  @IsOptional()
  @IsObject()
  @Type(() => UserAddressDto)
  address?: UserAddressDto;

  @ApiProperty({ example: { customField: 'value' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
