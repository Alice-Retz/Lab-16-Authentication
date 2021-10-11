const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('Lab 16 Authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const testUser = { email: 'a@a.com', password: 'pass1234', role: 'USER' };

  it('signs up a user via POST', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
      role: 'USER',
    });
  });

  xit('should send a 400 error if email already exists', async () => {
    await UserService.create(testUser);
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.status).toBe(400);
  });

  xit('logs in a user via POST', async () => {
    await UserService.create(testUser);
    const res = await request(app).post('/api/v1/auth/login').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
      role: 'USER',
    });
  });

  xit('should send a 401 error if log in info is incorrect', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'a@a.com',
      password: '1234pass',
    });
    expect(res.status).toBe(401);
  });

  xit('returns the currently logged in user', async () => {
    await UserService.create(testUser);
    const agent = await request.agent(app);

    await agent.post('/api/v1/auth/login').send(testUser);

    const res = await agent.get('/api/v1/auth/me');
    expect(res.body).toEqual({ id: '1', email: 'a@a.com' });
  });


  afterAll(() => {
    pool.end();
  });
});
