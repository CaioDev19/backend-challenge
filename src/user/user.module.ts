import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BcryptModule],
  controllers: [UserController],
  providers: [
    UserService,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateUserUseCase,
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
