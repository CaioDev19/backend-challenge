import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadataDtoParameters } from './props';

export class PaginationMetadataDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ paginationQueryDto, count }: PaginationMetadataDtoParameters) {
    this.page = paginationQueryDto.page;
    this.limit = paginationQueryDto.limit;
    this.count = count;
    this.pageCount = Math.ceil(this.count / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
