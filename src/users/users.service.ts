import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Employment } from '../employment/entities/employment.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Employment) private employmentRepo: Repository<Employment>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const employment = await this.employmentRepo.findOne({
      where: { id: createUserDto.employmentTypeId },
    });
    if (!employment) throw new Error('Employment type not found');

    const user = this.userRepo.create({ ...createUserDto, employmentType: employment });
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({ relations: ['employmentType'] });
  }

async getEmploymentByLogin(username: string, password: string) {
  const user = await this.userRepo.findOne({
    where: { username, password },
    relations: ['employmentType'],
  });
  if (!user) throw new Error('User not found or password incorrect');
  
  return {
    employmentType: user.employmentType.type,
  };
}
}
