import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { TEST_ENV } from '@/shared/test-helper/test.env';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from '@/modules/user/interface/http/dtos/user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let persistentDriverService: PersistentDriverService<any>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AppModule,
        PersistenceModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    persistentDriverService = app.get(PersistentDriverService);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // truncate tables
    await persistentDriverService.executeSQL(
      `TRUNCATE TABLE users RESTART IDENTITY CASCADE`,
      [],
    );

    await app.init();
  });

  afterAll(async () => {
    await persistentDriverService.executeSQL(
      `TRUNCATE TABLE users RESTART IDENTITY CASCADE`,
      [],
    );
  });

  describe('POST /users', () => {
    const validUser: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
      locale: 'en-US',
      address: {
        streetAddress: '123 Test St',
        locality: 'Test City',
        region: 'Test Region',
        postalCode: '12345',
      },
    };

    describe('Authorization', () => {
      it('should throw 401 when no api key is provided', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send(validUser)
          .expect(401);
      });

      it('should throw 401 when invalid api key is provided', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('x-api-key', 'invalid-key')
          .send(validUser)
          .expect(401);
      });
    });

    describe('User Creation', () => {
      it('should create user with all fields', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validUser)
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.email).toBe(validUser.email);
            expect(res.body.name).toBe(validUser.name);
            expect(res.body.password).toBeUndefined();
            expect(res.body.address).toEqual(validUser.address);
          });
      });

      it('should not create user with duplicate email', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validUser)
          .expect(HttpStatus.CONFLICT);
      });

      it('should create user with minimal fields', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send({
            email: 'minimal@example.com',
            password: 'Password123!',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.email).toBe('minimal@example.com');
          });
      });
    });
  });
  //
  // describe('GET /users', () => {
  //   it('should get paginated users', () => {
  //     return request(app.getHttpServer())
  //       .get('/users')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('data');
  //         expect(res.body).toHaveProperty('meta');
  //         expect(Array.isArray(res.body.data)).toBe(true);
  //       });
  //   });
  //
  //   it('should filter by search term', () => {
  //     return request(app.getHttpServer())
  //       .get('/users?search=test@example.com')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  //         expect(res.body.data[0].email).toBe('test@example.com');
  //       });
  //   });
  // });
  //
  // describe('GET /users/:id', () => {
  //   let userId: string;
  //
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/users')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         email: 'getbyid@example.com',
  //         password: 'Password123!',
  //         name: 'Get By ID User',
  //       });
  //     userId = res.body.id;
  //   });
  //
  //   it('should get user by id', () => {
  //     return request(app.getHttpServer())
  //       .get(`/users/${userId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.id).toBe(userId);
  //         expect(res.body.email).toBe('getbyid@example.com');
  //         expect(res.body.password).toBeUndefined();
  //         expect(res.body.password_hash).toBeUndefined();
  //       });
  //   });
  //
  //   it('should return 404 for non-existent user', () => {
  //     const nonExistentId = crypto.randomUUID();
  //     return request(app.getHttpServer())
  //       .get(`/users/${nonExistentId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(404);
  //   });
  // });
  //
  // describe('PUT /users/:id', () => {
  //   let userId: string;
  //
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/users')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         email: 'update@example.com',
  //         password: 'Password123!',
  //         name: 'Update Test User',
  //       });
  //     userId = res.body.id;
  //   });
  //
  //   it('should update user', () => {
  //     return request(app.getHttpServer())
  //       .put(`/users/${userId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         name: 'Updated Name',
  //         locale: 'fr-FR',
  //       })
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.name).toBe('Updated Name');
  //         expect(res.body.locale).toBe('fr-FR');
  //         expect(res.body.email).toBe('update@example.com');
  //       });
  //   });
  //
  //   it('should not allow email update', () => {
  //     return request(app.getHttpServer())
  //       .put(`/users/${userId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         email: 'newemail@example.com',
  //       })
  //       .expect(400);
  //   });
  // });
  //
  // describe('DELETE /users/:id', () => {
  //   let userId: string;
  //
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/users')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         email: 'delete@example.com',
  //         password: 'Password123!',
  //       });
  //     userId = res.body.id;
  //   });
  //
  //   it('should delete user', () => {
  //     return request(app.getHttpServer())
  //       .delete(`/users/${userId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200);
  //   });
  //
  //   it('should return 404 after deletion', () => {
  //     return request(app.getHttpServer())
  //       .get(`/users/${userId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(404);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
