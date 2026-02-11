import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum PlanKey {
  STARTER = 'starter',
  PRO = 'pro',
}

export class GrantMonthlyDto {
  @IsString()
  userId!: string;

  @IsEnum(PlanKey)
  plan!: PlanKey;

  /** invoiceId / subscription cycle id, used for idempotency */
  @IsString()
  refId!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
