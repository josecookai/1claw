import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum TopupPack {
  TOPUP_10 = 'topup10',
  TOPUP_50 = 'topup50',
}

export class TopupDto {
  @IsString()
  userId!: string;

  @IsEnum(TopupPack)
  pack!: TopupPack;

  /** paymentIntentId or checkoutSessionId */
  @IsString()
  refId!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
