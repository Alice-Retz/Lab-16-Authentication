const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('Lab 16 Authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const testUser = { email: 'a@a.com', password: 'pass1234' };

  it('signs up a user via POST', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
    });
  });

  it('should send a 400 error if email already exists', async () => {
    await UserService.create(testUser);
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.status).toBe(400);
  });

  it('logs in a user via POST', async () => {
    await UserService.create({
      email: 'a@a.com',
      password: 'pass1234',
    });

    const res = await request(app).post('/api/v1/auth/login').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
    });
  });

  // it('returns the currently logged in user', async () => {
  //   const res = await request(app)
  //     .get('/api/v1/auth/me')
  //     .then((res) => {
  //       expect(res.body).toEqual();
  //     });
  // });

  afterAll(() => {
    pool.end();
  });
});
