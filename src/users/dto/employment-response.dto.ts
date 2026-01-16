import { ApiProperty } from '@nestjs/swagger';

export class EmploymentResponseDto {
  @ApiProperty()
  employmentType: string;
}
