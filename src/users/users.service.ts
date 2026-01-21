import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Validate and transform dateOfBirth
    // Transform empty string to null to avoid PostgreSQL DateTimeParseError
    let dateOfBirth: string | null = null;
    
    if (createUserDto.dateOfBirth) {
      const trimmedDate = createUserDto.dateOfBirth.trim();
      if (trimmedDate !== '') {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(trimmedDate)) {
          // Additional validation: check if it's a valid date
          const date = new Date(trimmedDate);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date. Please provide a valid date.');
          }
          dateOfBirth = trimmedDate;
        } else {
          throw new Error('Invalid date format. Expected YYYY-MM-DD');
        }
      }
    }
    
    const userData = {
      ...createUserDto,
      dateOfBirth,
    };
    
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find();
  }
}
