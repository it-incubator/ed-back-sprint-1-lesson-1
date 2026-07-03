import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Uber API',
      version: '1.0.0',
      description: 'Uber API documentation',
    },
  },
  // swagger-jsdoc собирает документацию из всех *.swagger.yml файлов проекта.
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключает Swagger UI по адресу /api.
export const setupSwagger = (app: Express) => {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
