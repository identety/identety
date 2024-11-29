import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Identety API')
    .setDescription('Identity Provider API')
    .setVersion('1.0')
    // Add security definition for API key
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'x-modules-key',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  //--------------------------------
  // Validation Pipe Setup
  //--------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
