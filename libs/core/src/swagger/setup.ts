import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { trimEnd } from 'lodash';

export async function setupSwagger(app: INestApplication, version: string, apiUrl = '/'): Promise<void> {
  const documentBuilder = new DocumentBuilder()
    .setTitle('1811 Labs API')
    .setDescription(`1811 Labs APIs.`)
    .setContact('1811 Labs', 'https://1811labs.com', 'support@1811labs.com')
    .setVersion(version)
    .addBearerAuth();

  documentBuilder.addServer('https://api.1811labs.com', 'Production');
  documentBuilder.addServer('https://api.1811labs.dev', 'Test');

  if (process.env.NODE_ENV === 'development') {
    documentBuilder.addServer('http://localhost:3001', 'Localhost');
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup('/api/doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API documentation',
  });

  Logger.log(`Documentation: ${trimEnd(apiUrl, '/')}/api/doc`);
}
