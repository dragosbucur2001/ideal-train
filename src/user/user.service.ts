import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dtos/create-user.dto';
import { LoginUserDto } from './models/dtos/login-user.dto';
import { UpdateUserDto } from './models/dtos/update-user.dto';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async getUserById(id: number): Promise<User> {
    let user = await this.userRepository.findOne(id);
    if (!user)
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    return user;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    await this.validateNewUser(createUserDto);

    createUserDto.password = await this.authService.hashPassword(createUserDto.password);
    delete createUserDto.password_confirmation;

    let user: User = await this.userRepository.save(createUserDto);
    if (!user)
      throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);

    return user;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<string> {
    let { email, password } = loginUserDto;

    let user = await this.userRepository.findOne({ email });
    if (!user)
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST);

    let result = await this.authService.comparePasswords(password, user.password);
    if (!result)
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST);

    return this.authService.generateJwt(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    let queryResult = await this.userRepository.update(id, updateUserDto);
    if (queryResult.affected <= 0)
      throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);

    return true;
  }

  async deleteUser(id: number): Promise<boolean> {
    let queryResult = await this.userRepository.delete(id);
    console.log(queryResult);
    if (queryResult.affected <= 0)
      throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);

    return true;
  }

  private async validateNewUser(createUserDto: CreateUserDto) {
    let { password, password_confirmation, email, handle } = createUserDto;
    let errors = [];

    if (password !== password_confirmation)
      errors.push("passwords do not match");

    let userNumber = await this.userRepository.count({ email });
    if (userNumber > 0)
      errors.push("email is already used");

    userNumber = await this.userRepository.count({ handle });
    if (userNumber)
      errors.push("handle already exists")

    if (errors.length > 0)
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: errors
      }, HttpStatus.BAD_REQUEST);
  }
}
