import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { User } from 'src/common/entities';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, name, password } = createUserDto;
      const existingUser: User = await this.userService.findByEmail(email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword: string =
        await this.bcryptService.hashPassword(password);

      const user: User = new User({ name, email, password: hashedPassword });

      return await this.userService.save(user);
    } catch (error: unknown) {
      throw error;
    }
  }
}
