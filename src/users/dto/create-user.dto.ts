import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: String, description: 'Date of birth in YYYY-MM-DD', required: false })
  dateOfBirth?: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
