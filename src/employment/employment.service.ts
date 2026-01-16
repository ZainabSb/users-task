import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employment } from './entities/employment.entity';

@Injectable()
export class EmploymentService {
  constructor(@InjectRepository(Employment) private repo: Repository<Employment>) {}

  async createDefaultEmployments() {
    const types = [
      { type: 'part-time', hoursPerDay: 6, pricePerHour: 15 },
      { type: 'full-time', hoursPerDay: 8, pricePerHour: 20 },
      { type: 'contract', hoursPerDay: 8, pricePerHour: 25 },
    ];

    for (const t of types) {
      const exists = await this.repo.findOne({ where: { type: t.type } });
      if (!exists) await this.repo.save(t); 
    }
  }

  findByType(type: string) {
    return this.repo.findOne({ where: { type } });
  }
}
