import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { UserCache } from './user.cache';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
} from './use-cases';
import { UpdateUserPasswordUseCase } from './use-cases/update-user-password.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BcryptModule],
  controllers: [UserController],
  providers: [
    UserCache,
    UserService,
    UpdateUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    UpdateUserPasswordUseCase,
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
