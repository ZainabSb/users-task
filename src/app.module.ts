import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EmploymentModule } from './employment/employment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '',       
      password: '',   
      database: 'usersdb',       
      autoLoadEntities: true,   
      synchronize: true,          
    }),
    UsersModule,
    EmploymentModule,
  ],
})
export class AppModule {}


