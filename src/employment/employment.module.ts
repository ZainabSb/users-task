import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentService } from './employment.service';
import { EmploymentController } from './employment.controller';
import { Employment } from './entities/employment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employment])],
  controllers: [EmploymentController],
  providers: [EmploymentService],
  exports: [EmploymentService],
})
export class EmploymentModule {}

