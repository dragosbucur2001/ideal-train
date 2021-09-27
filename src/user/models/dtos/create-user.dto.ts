import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    handle: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 32)
    @Exclude({ toPlainOnly: true })
    password: string;

    @IsString()
    @Length(8, 32)
    @Exclude({ toPlainOnly: true })
    password_confirmation: string;
}
