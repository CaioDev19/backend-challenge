import { IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class UserReportEventDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  userId: number;
}
