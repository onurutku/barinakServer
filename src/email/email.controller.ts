import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get('verification')
  plainTextEmail(@Query('mailTo') mailTo: string) {
    return this.emailService.sendVerificationEmail(mailTo);
  }
}
