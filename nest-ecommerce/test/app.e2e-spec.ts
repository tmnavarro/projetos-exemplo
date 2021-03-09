import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppTest } from './constants';

describe('APP TESTING', () => {
  const App = new AppTest();
  let app: INestApplication;

  beforeEach(async () => {
    app = await App.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });
});
