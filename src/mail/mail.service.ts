import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@Injectable()
export class MailService {
    constructor(private readonly jwtService: JwtService) {}

    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    sendConfirmationEmail(email: string): void {
        let token = this.jwtService.sign({ email });
        let url = `http://${process.env.URL}:${process.env.PORT}/auth/confirm/${token}`;

        this.transporter.sendMail({
            to: email,
            subject: "Confirmation code",
            html: `Please click this to confirm email: <a href="${url}">${url}</a>`
        });
    }

    verifyToken(token: string): any {
        let payload = this.jwtService.decode(token, {json: true});
        let email = payload['email'];

        try {
            this.jwtService.verify(token);
            return email;
        } catch {
            this.sendConfirmationEmail(email);
            throw new HttpException("Code expired, resending confirmation email", HttpStatus.BAD_REQUEST);
        }
    }
}
