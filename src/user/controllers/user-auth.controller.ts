import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "../models/dtos/create-user.dto";
import { LoginUserDto } from "../models/dtos/login-user.dto";
import { User } from "../models/user.entity";
import { UserService } from "../user.service";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UserAuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<string> {
    return this.userService.loginUser(loginUserDto);
  }
}