import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.MAIL_SECRET,
      signOptions: { expiresIn: process.env.MAIL_TTL }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
