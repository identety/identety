// src/modules/role/interface/http/__test__/role.controller.e2e-spec.ts

import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { TEST_ENV } from '@/shared/test-helper/test.env';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { ConfigModule } from '@nestjs/config';
import { CreateRoleDto } from '../dtos/role.dto';

describe('RoleController (e2e)', () => {
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
      `TRUNCATE TABLE roles RESTART IDENTITY CASCADE`,
      [],
    );

    await app.init();
  });

  afterAll(async () => {
    await persistentDriverService.executeSQL(
      `TRUNCATE TABLE roles RESTART IDENTITY CASCADE`,
      [],
    );
  });

  describe('POST /roles', () => {
    const validRole: CreateRoleDto = {
      name: 'Content Editor',
      description: 'Can edit and publish content',
      is_system: false,
    };

    describe('Authorization', () => {
      it('should throw 401 when no api key is provided', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .send(validRole)
          .expect(401);
      });

      it('should throw 401 when invalid api key is provided', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .set('x-api-key', 'invalid-key')
          .send(validRole)
          .expect(401);
      });
    });

    describe('Role Creation', () => {
      it('should create role with all fields', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validRole)
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.name).toBe('content_editor'); // snake_case conversion
            expect(res.body.description).toBe(validRole.description);
            expect(res.body.is_system).toBe(false);
          });
      });

      it('should not create role with duplicate name', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validRole)
          .expect(HttpStatus.CONFLICT);
      });

      it('should create role with minimal fields', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send({
            name: 'Basic Role',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.name).toBe('basic_role');
            expect(res.body.description).toBeNull();
            expect(res.body.is_system).toBe(false);
          });
      });

      it('should not allow creating system roles', () => {
        return request(app.getHttpServer())
          .post('/roles')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send({
            name: 'System Role',
            is_system: true,
          })
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('GET /roles', () => {
    it('should get paginated roles', () => {
      return request(app.getHttpServer())
        .get('/roles')
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nodes');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.nodes)).toBe(true);
        });
    });

    it('should filter columns', () => {
      return request(app.getHttpServer())
        .get('/roles?columns=id,name,description')
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(200)
        .expect((res) => {
          const role = res.body.nodes[0];
          const keys = Object.keys(role);
          expect(keys).toEqual(['id', 'name', 'description']);
        });
    });
  });

  describe('GET /roles/:id', () => {
    let roleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/roles')
        .set('x-api-key', TEST_ENV.API_KEY)
        .send({
          name: 'Get By ID Role',
          description: 'Test get by ID',
        });
      roleId = res.body.id;
    });

    it('should get role by id', () => {
      return request(app.getHttpServer())
        .get(`/roles/${roleId}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(roleId);
          expect(res.body.name).toBe('get_by_id_role');
        });
    });

    it('should return 404 for non-existent role', () => {
      return request(app.getHttpServer())
        .get(`/roles/${crypto.randomUUID()}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(404);
    });
  });

  describe('PATCH /roles/:id', () => {
    let roleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/roles')
        .set('x-api-key', TEST_ENV.API_KEY)
        .send({
          name: 'Update Test Role',
          description: 'Role for testing updates',
        });
      roleId = res.body.id;
    });

    it('should update role', () => {
      return request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .send({
          name: 'Updated Role Name',
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('updated_role_name');
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should allow partial updates', () => {
      return request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .send({
          description: 'Only description updated',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe('Only description updated');
          expect(res.body.name).toBe('updated_role_name'); // name unchanged
        });
    });
  });

  describe('DELETE /roles/:id', () => {
    let roleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/roles')
        .set('x-api-key', TEST_ENV.API_KEY)
        .send({
          name: 'Role To Delete',
        });
      roleId = res.body.id;
    });

    it('should delete role', () => {
      return request(app.getHttpServer())
        .delete(`/roles/${roleId}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/roles/${roleId}`)
        .set('x-api-key', TEST_ENV.API_KEY)
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
