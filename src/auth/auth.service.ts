import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/models/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJwt(user: User): string {
        delete user.password;
        delete user.updated_at;
        delete user.created_at;
        return this.jwtService.sign({user});
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    comparePasswords(password: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, storedPassword);
    }
}
