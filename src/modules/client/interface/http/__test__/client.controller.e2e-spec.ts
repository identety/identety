import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { TEST_ENV } from '@/shared/test-helper/test.env';
import { ClientType, GrantType } from '../dtos/client.dto';

describe('ClientController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /clients', () => {
    const validPrivateClient = {
      name: 'Private Client',
      type: ClientType.PRIVATE,
      redirectUris: ['https://example.com/callback'],
      allowedScopes: ['openid', 'profile'],
      allowedGrants: [GrantType.AUTHORIZATION_CODE],
      settings: {
        tokenEndpointAuthMethod: 'client_secret_basic',
        accessTokenTTL: 3600,
      },
    };

    const validPublicClient = {
      name: 'Public Client',
      type: ClientType.PUBLIC,
      redirectUris: ['https://spa.example.com/callback'],
      allowedScopes: ['openid', 'profile'],
      allowedGrants: [GrantType.AUTHORIZATION_CODE],
      settings: {
        tokenEndpointAuthMethod: 'none',
      },
    };

    const validM2MClient = {
      name: 'M2M Client',
      type: ClientType.M2M,
      // allowedScopes: ['read:users', 'write:users'],
      allowedGrants: [GrantType.CLIENT_CREDENTIALS],
    };

    describe('Authorization', () => {
      it('should throw 401 when no api key is provided', () => {
        return request(app.getHttpServer())
          .post('/clients')
          .send(validPublicClient)
          .expect(401);
      });

      it('should throw 401 when invalid api key is provided', () => {
        return request(app.getHttpServer())
          .post('/clients')
          .set('x-api-key', 'invalid-key')
          .send(validPublicClient)
          .expect(401);
      });
    });

    describe('Client Type', () => {
      // Public Client tests
      it('should create public client without client secret', () => {
        return request(app.getHttpServer())
          .post('/clients')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validPublicClient)
          .expect(201)
          .expect((res) => {
            expect(res.body['id']).toBeDefined();
            expect(res.body['client_id']).toContain('public_');
            expect(res.body['client_secret']).toBe('');
            expect(res.body.type).toBe(ClientType.PUBLIC);
            expect(res.body['require_pkce']).toBe(true);
            expect(res.body['redirect_uris']).toStrictEqual(
              validPublicClient.redirectUris,
            );
          });
      });

      // Private Client tests
      it('should create private client without client secret', () => {
        return request(app.getHttpServer())
          .post('/clients')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validPrivateClient)
          .expect(201)
          .expect((res) => {
            expect(res.body['id']).toBeDefined();
            expect(res.body['client_id']).toContain('private_');
            expect(res.body['client_secret']).toContain('private_secret_');
            expect(res.body.type).toBe(ClientType.PRIVATE);
            expect(res.body['require_pkce']).toBe(false);
            expect(res.body['redirect_uris']).toStrictEqual(
              validPrivateClient.redirectUris,
            );
          });
      });

      // M2M Client tests
      it('should create m2m client with client credentials grant', () => {
        return request(app.getHttpServer())
          .post('/clients')
          .set('x-api-key', TEST_ENV.API_KEY)
          .send(validM2MClient)
          .expect(201)
          .expect((res) => {
            // console.log(res.body);
            expect(res.body['client_id']).toContain('m2m_');
            expect(res.body['client_secret']).toContain('m2m_secret_');
            expect(res.body.type).toBe(ClientType.M2M);
            expect(res.body['require_pkce']).toBe(false);
            // expect(res.body['redirect_uris']).toStrictEqual([]);
            expect(res.body['allowed_grants']).toStrictEqual([
              GrantType.CLIENT_CREDENTIALS,
            ]);
          });
      });
    });
  });

  // describe('GET /clients', () => {
  //   it('should get paginated clients', () => {
  //     return request(app.getHttpServer())
  //       .get('/clients')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('nodes');
  //         expect(res.body).toHaveProperty('meta');
  //         expect(Array.isArray(res.body.nodes)).toBe(true);
  //       });
  //   });
  //
  //   it('should filter columns', () => {
  //     return request(app.getHttpServer())
  //       .get('/clients?columns=id,name,type')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         const client = res.body.nodes[0];
  //         expect(Object.keys(client)).toEqual(['id', 'name', 'type']);
  //       });
  //   });
  // });

  // describe('GET /clients/:id', () => {
  //   let clientId: string;
  //
  //   beforeAll(async () => {
  //     // Create a client to test with
  //     const res = await request(app.getHttpServer())
  //       .post('/clients')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         name: 'Test Client',
  //         type: ClientType.PRIVATE,
  //       });
  //     clientId = res.body.id;
  //   });
  //
  //   it('should get client by id', () => {
  //     return request(app.getHttpServer())
  //       .get(`/clients/${clientId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.id).toBe(clientId);
  //       });
  //   });
  //
  //   // it('should return 404 for non-existent client', () => {
  //   //   return request(app.getHttpServer())
  //   //     .get('/clients/non-existent-id')
  //   //     .set('x-api-key', TEST_ENV.API_KEY)
  //   //     .expect(404);
  //   // });
  // });

  // describe('PATCH /clients/:id', () => {
  //   let clientId: string;
  //
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/clients')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         name: 'Test Client',
  //         type: ClientType.PRIVATE,
  //       });
  //     clientId = res.body.id;
  //   });
  //
  //   it('should update client', () => {
  //     return request(app.getHttpServer())
  //       .patch(`/clients/${clientId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         name: 'Updated Client',
  //         allowedScopes: ['openid'],
  //       })
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.name).toBe('Updated Client');
  //         expect(res.body.allowedScopes).toEqual(['openid']);
  //       });
  //   });
  //
  //   it('should not allow updating type', () => {
  //     return request(app.getHttpServer())
  //       .patch(`/clients/${clientId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         type: ClientType.PUBLIC,
  //       })
  //       .expect(400);
  //   });
  // });

  // describe('DELETE /clients/:id', () => {
  //   let clientId: string;
  //
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/clients')
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .send({
  //         name: 'Test Client',
  //         type: ClientType.PRIVATE,
  //       });
  //     clientId = res.body.id;
  //   });
  //
  //   it('should delete client', () => {
  //     return request(app.getHttpServer())
  //       .delete(`/clients/${clientId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(200);
  //   });
  //
  //   it('should return 404 after deletion', () => {
  //     return request(app.getHttpServer())
  //       .get(`/clients/${clientId}`)
  //       .set('x-api-key', TEST_ENV.API_KEY)
  //       .expect(404);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
