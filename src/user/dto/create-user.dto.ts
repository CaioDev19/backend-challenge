import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
