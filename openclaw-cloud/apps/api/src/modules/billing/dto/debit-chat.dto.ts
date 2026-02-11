import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class DebitChatDto {
  @IsString()
  userId!: string;

  /** requestId for idempotency */
  @IsString()
  requestId!: string;

  /** V1: estimated credits; final settlement can come later */
  @IsInt()
  @Min(1)
  estimatedCredits!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
