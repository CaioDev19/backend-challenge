import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/common/entities';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { PaginationQueryDto } from 'src/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { REDIS_CACHE_TTL } from 'src/common/enums/redis-ttl';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserUseCase.execute(createUserDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(REDIS_CACHE_TTL.FIVE_SECONDS)
  @Get()
  @ApiOperation({ summary: 'Retrieve paginated list of users' })
  @ApiPaginatedResponse(User)
  @ApiQuery({ type: PaginationQueryDto })
  async find(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationDto<User>> {
    return await this.userService.findPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.deleteUserUseCase.execute(id);
  }
}
