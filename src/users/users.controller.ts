import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { EmploymentResponseDto } from './dto/employment-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create new user
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // List users
  @Get('list')
  findAll() {
    return this.usersService.findAll();
  }

  // Get employment type by user credentials
  @Post('employment-by-login')
  @ApiResponse({ status: 200, type: EmploymentResponseDto })
  getEmployment(@Body() loginDto: LoginDto) {
    return this.usersService.getEmploymentByLogin(
      loginDto.username,
      loginDto.password,
    );
  }
}
