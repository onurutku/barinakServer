import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendVerificationEmail(mailTo: string) {
    await this.mailService.sendMail({
      to: mailTo,
      from: 'barinakdeneme@gmail.com',
      subject: 'Verify your email address',
      html: `<a href='https://barinak.herokuapp.com/auth/verify-user?email=${mailTo}'>Click here to verify your email</a>`,
    });
    return 'Please check your mailbox to verify your account';
  }
}
