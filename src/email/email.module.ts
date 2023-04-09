import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.eu-north-1.amazonaws.com',
        auth: {
          user: 'AKIAX5QNHV6DJDRGU3P3',
          pass: 'BLfomXzyglZDB6Qf9LYSPpZjzpGWHSJd+Y/ype/zPNBU',
        },
        port: 587,
        secure: false,
      },
      template: {
        dir: join(__dirname, 'email/mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
