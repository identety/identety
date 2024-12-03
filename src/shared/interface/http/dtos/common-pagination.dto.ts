import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CommonPaginationDto {
  @ApiProperty({ type: Number, default: 1, required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ type: Number, default: 10, required: false })
  @IsOptional()
  limit: number;

  @ApiProperty({ default: 'created_at', required: false })
  @IsOptional()
  sortBy: string;

  @ApiProperty({ enum: ['asc', 'desc'], default: 'desc', required: false })
  @IsOptional()
  sort: 'asc' | 'desc';

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  columns?: string;
}

class PaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;
}

export class CommonPaginationResponseDto<T> {
  @ApiProperty()
  nodes: T[];

  @ApiProperty({ type: Number, default: 10, required: false })
  meta: PaginationMeta;
}
