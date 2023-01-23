import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserLocalAuthGuard } from './auth/user/user.local.auth.guard';
import { AdminLocalAuthGuard } from './auth/admin/admin.local.auth.guard';
import { UserAuthService } from './auth/user/user.auth.service';
import { AdminAuthService } from './auth/admin/admin.auth.service';
import Stripe from 'stripe';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userAuthService: UserAuthService,
    private adminAuthService: AdminAuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(UserLocalAuthGuard)
  @Post('auth/user')
  async loginUser(@Request() req) {
    return this.userAuthService.login(req.user);
  }

  @UseGuards(AdminLocalAuthGuard)
  @Post('auth/admin')
  async loginAdmin(@Request() req) {
    return this.adminAuthService.login(req.user);
  }

  @Post('/payment-webhook')
  async paymentWebhook(@Body() stripeEvent: Stripe.Event) {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        console.log('success:', paymentIntent);
        break;
      case 'payment_intent.canceled':
        const paymentIntent2 = stripeEvent.data.object;
        console.log('canceled', paymentIntent2);
        break;
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }
    return;
  }
}
