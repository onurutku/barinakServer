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
        host: 'ses-smtp-user.20230408-103037',
        auth: {
          user: 'apikey',
          pass: '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',
        },
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
