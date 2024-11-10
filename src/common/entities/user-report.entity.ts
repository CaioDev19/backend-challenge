import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserReportAction } from '../enums/user-report-action';
import { User } from './user.entity';

@Entity('user-report')
export class UserReport extends AbstractEntity<UserReport> {
  @ApiProperty({
    description: 'The user where the action happened',
  })
  @Index()
  @ManyToOne(() => User, (user) => user.reports, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'The action',
  })
  @Column({
    type: 'enum',
    enum: UserReportAction,
    nullable: false,
  })
  action: UserReportAction;

  @ApiProperty({
    description: 'Date and time when the action happened',
    example: '2024-11-08T12:34:56.789Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
