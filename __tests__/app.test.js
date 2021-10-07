const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('Lab 16 Authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'a@a.com', password: 'pass1234' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
    });
  });

  afterAll(() => {
    pool.end();
  });
});