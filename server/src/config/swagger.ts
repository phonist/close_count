import swaggerJSDoc from 'swagger-jsdoc';
import env from './env';

const serverUrl =
  process.env.SWAGGER_SERVER_URL || `http://localhost:${env.port}`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Close Count API',
    version: '1.0.0',
    description: 'API documentation for the Close Count server.',
  },
  servers: [{ url: serverUrl }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      AuthTokenResponse: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
        },
      },
      AuthUserResponse: {
        type: 'object',
        required: ['_id', 'name', 'email', 'date'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar: { type: 'string', nullable: true },
          date: { type: 'string', format: 'date-time' },
        },
      },
      CreateTimerRequest: {
        type: 'object',
        required: ['title', 'description', 'timer'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          timer: { type: 'string' },
          isRecurring: { type: 'boolean' },
          recurrence: { $ref: '#/components/schemas/RecurrenceRule' },
          timezone: { type: 'string' },
        },
      },
      RecurrenceRule: {
        type: 'object',
        required: ['frequency'],
        properties: {
          frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
          interval: { type: 'integer', minimum: 1 },
          daysOfWeek: {
            type: 'array',
            items: { type: 'integer', minimum: 0, maximum: 6 },
          },
          dayOfMonth: { type: 'integer', minimum: 1, maximum: 31 },
        },
      },
      TimerResponse: {
        type: 'object',
        required: [
          '_id',
          'user',
          'title',
          'description',
          'timer',
          'status',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          timer: { type: 'string' },
          status: { type: 'string', enum: ['0', '1'] },
          isRecurring: { type: 'boolean' },
          recurrence: { $ref: '#/components/schemas/RecurrenceRule' },
          timezone: { type: 'string' },
          nextRunAt: { type: 'string', format: 'date-time', nullable: true },
          lastRunAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TimerListResponse: {
        type: 'array',
        items: { $ref: '#/components/schemas/TimerResponse' },
      },
      ErrorMessage: {
        type: 'object',
        properties: {
          msg: { type: 'string' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['src/features/**/*.routes.ts'],
});

export default swaggerSpec;
