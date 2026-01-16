import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: String, description: 'Date of birth in YYYY-MM-DD' })
  dateOfBirth: string;

  @ApiProperty({ description: 'Employment type id' })
  employmentTypeId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
