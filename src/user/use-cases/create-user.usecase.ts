import { Injectable, ConflictException } from '@nestjs/common';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { User } from 'src/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserByEmailUseCase } from './find-user-by-email-usecase';
import { CreateUserDto } from '../dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, name, password } = createUserDto;

      const existingUser: User | undefined =
        await this.findUserByEmailUseCase.execute(email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword: string =
        await this.bcryptService.hashPassword(password);
      const user: User = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error: unknown) {
      throw error;
    }
  }
}
