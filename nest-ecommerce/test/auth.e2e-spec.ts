import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/dtos/auth.dto';

import * as mongoose from 'mongoose';
import { AppTest } from './constants';

describe('AppController (e2e)', () => {
  const App = new AppTest();
  let app: INestApplication;

  const user: RegisterDTO | LoginDTO = {
    username: 'userTester',
    password: 'password',
  };

  const userSellerRegister: RegisterDTO = {
    username: 'sellerTester',
    password: 'password',
    seller: true,
  };

  const userSellerLogin: LoginDTO = {
    username: 'sellerTester',
    password: 'password',
  };

  let userToken: string;
  let sellerToken: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async done => {
    await mongoose.disconnect(done);
  });

  beforeEach(async () => {
    app = await App.init();
  });

  it('register user ', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('userTester');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('register Seller ', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .set('Accept', 'application/json')
      .send(userSellerRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('sellerTester');
        expect(body.user.seller).toEqual(true);
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('Validade User exist not is register', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('login user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('userTester');
      })
      .expect(HttpStatus.CREATED);
  });

  it('login seller', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send(userSellerLogin)
      .expect(({ body }) => {
        sellerToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('sellerTester');
        expect(body.user.seller).toEqual(true);
      })
      .expect(HttpStatus.CREATED);
  });
});
