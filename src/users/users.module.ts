import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Employment } from '../employment/entities/employment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employment])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

