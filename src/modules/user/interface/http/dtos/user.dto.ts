import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CommonPaginationDto } from '@/shared/interface/http/dtos/common-pagination.dto';

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

export class UserListQueryDto extends CommonPaginationDto {
  @ApiProperty({
    description: 'Comma separated column names',
    example:
      'id,email,name,phone_number,address,locale,email_verified,phone_number_verified,created_at',
    enum: [
      'id',
      'email',
      'name',
      'phone_number',
      'address',
      'locale',
      'email_verified',
      'phone_number_verified',
      'created_at',
      'updated_at',
    ],
  })
  @IsOptional()
  @IsIn(
    [
      'id',
      'email',
      'name',
      'phone_number',
      'address',
      'locale',
      'email_verified',
      'phone_number_verified',
      'created_at',
      'updated_at',
    ],
    { each: true },
  )
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((col) => col.trim())
      : value,
  )
  columns?: string[];
}
