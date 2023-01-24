import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { UserLocalAuthGuard } from './auth/user/user.local.auth.guard';
import { AdminLocalAuthGuard } from './auth/admin/admin.local.auth.guard';
import { UserAuthService } from './auth/user/user.auth.service';
import { AdminAuthService } from './auth/admin/admin.auth.service';
import Stripe from 'stripe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private userAuthService: UserAuthService,
    private adminAuthService: AdminAuthService,
  ) {}

  @UseGuards(UserLocalAuthGuard)
  @Post('auth/user')
  @ApiTags('login')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async loginUser(@Request() req) {
    return this.userAuthService.login(req.user);
  }

  @UseGuards(AdminLocalAuthGuard)
  @Post('auth/admin')
  @ApiTags('login')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async loginAdmin(@Request() req) {
    return this.adminAuthService.login(req.user);
  }

  @Post('/payment-webhook')
  @ApiTags('payment')
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
