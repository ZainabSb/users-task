import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmploymentService } from './employment/employment.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('Users and Employment APIs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const employmentService = app.get(EmploymentService);
  await employmentService.createDefaultEmployments();

  await app.listen(3000);
}
bootstrap();
