import { Column, CreateDateColumn, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserReportAction } from '../enums/user-report-action';

@Entity('user-report')
export class UserReport extends AbstractEntity<UserReport> {
  @ApiProperty({
    description: 'The id of the user where the action happened',
  })
  @Column({
    nullable: false,
  })
  userId: number;

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
