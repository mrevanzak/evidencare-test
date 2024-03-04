import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create a new Nest application
  const app = await NestFactory.create(AppModule);

  // Apply a global validation pipe to the application
  app.useGlobalPipes(new ValidationPipe());

  // Start the application on port 3000
  await app.listen(3000);
}
void bootstrap();
