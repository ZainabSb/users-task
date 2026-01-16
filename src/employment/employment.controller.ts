import { Controller, Get, Param } from '@nestjs/common';
import { EmploymentService } from './employment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employment')
@Controller('employment')
export class EmploymentController {
  constructor(private readonly employmentService: EmploymentService) {}

  @Get(':type')
  async getInfo(@Param('type') type: string) {
    const emp = await this.employmentService.findByType(type);
    if (!emp) throw new Error('Employment type not found');
    return {
      type: emp.type,
      hoursPerDay: emp.hoursPerDay,
      pricePerHour: emp.pricePerHour,
    };
  }
}
