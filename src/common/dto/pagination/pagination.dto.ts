import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationMetadataDto } from './pagination-metadata.dto';
import { PaginationMetadataDtoParameters } from './pagination-metadata.dto/props';

export class PaginationDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PaginationMetadataDto })
  readonly metadata: PaginationMetadataDto;

  constructor(data: T[], metadata: PaginationMetadataDtoParameters) {
    this.data = data;
    this.metadata = new PaginationMetadataDto(metadata);
  }
}
