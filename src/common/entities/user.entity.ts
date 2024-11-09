import { Column, CreateDateColumn, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User extends AbstractEntity<User> {
  @ApiProperty({
    description: 'Name of the user',
    maxLength: 125,
    example: 'John Doe',
  })
  @Column({
    length: 125,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description:
      'Email address of the user, must be unique and in valid email format',
    maxLength: 255,
    example: 'john.doe@example.com',
  })
  @Index()
  @Column({
    length: 255,
    nullable: false,
    unique: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password of the user (sensitive data is excluded from responses)',
    example: 'Password123!',
    writeOnly: true,
  })
  @Exclude({ toPlainOnly: true }) // Exclude password from plain object serialization
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    description: 'Date and time when the user was created',
    example: '2024-11-08T12:34:56.789Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
