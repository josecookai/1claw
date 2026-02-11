import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';

@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private webhooks: WebhooksService) {}

  @Post('stripe')
  async stripe(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string | undefined,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      return { error: 'Raw body required for webhook verification' };
    }
    return this.webhooks.handleStripe(rawBody, signature ?? '');
  }
}
