import { Controller, Get, Body, Param, Delete, ParseIntPipe, Put, UseInterceptors, ClassSerializerInterceptor, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../models/dtos/update-user.dto';
import { User } from '../models/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('users')
@Auth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Req() req): Promise<User[]> {
    console.log(req.user);
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<any> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
