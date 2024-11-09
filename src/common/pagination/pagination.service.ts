import { FindOneOptions, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination/pagination-query.dto';
import { PaginationDto } from '../dto/pagination/pagination.dto';

export class Pagination<T> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly metadata: PaginationQueryDto,
  ) {}

  async paginate(options?: FindOneOptions<T>): Promise<PaginationDto<T>> {
    const [items, count]: [T[], number] = await this.repository.findAndCount({
      take: this.metadata.limit,
      skip: this.metadata.skip,
      ...options,
    });

    return new PaginationDto(items, {
      count,
      paginationQueryDto: this.metadata,
    });
  }
}
