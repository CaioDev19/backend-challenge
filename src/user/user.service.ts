import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { User } from 'src/common/entities';
import { Pagination } from 'src/common/pagination/pagination.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationDto<User>> {
    try {
      const pagination: Pagination<User> = new Pagination(
        this.userRepository,
        paginationQuery,
      );

      return await pagination.paginate();
    } catch (error: unknown) {
      throw error;
    }
  }
}
