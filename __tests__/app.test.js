const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('Lab 16 Authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const testUser = {
    email: 'a@a.com',
    password: 'pass1234',
    roleTitle: 'USER',
  };

  //=====================================================//

  it('signs up a user via POST', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
      role: 'USER',
    });
  });

  //=====================================================//

  it('should send a 400 error if email already exists', async () => {
    await UserService.create(testUser);
    const res = await request(app).post('/api/v1/auth/signup').send(testUser);

    expect(res.status).toBe(400);
  });

  //=====================================================//

  it('logs in a user via POST', async () => {
    await UserService.create(testUser);
    const res = await request(app).post('/api/v1/auth/login').send(testUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'a@a.com',
      role: 'USER',
    });
  });

  //=====================================================//

  it('should send a 401 error if log in info is incorrect', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'a@a.com',
      password: '1234pass',
    });
    expect(res.status).toBe(401);
  });

  //=====================================================//

  it('returns the currently logged in user', async () => {
    await UserService.create(testUser);
    const agent = await request.agent(app);

    await agent.post('/api/v1/auth/login').send(testUser);

    const res = await agent.get('/api/v1/auth/me');
    expect(res.body).toEqual({
      id: '1',
      email: 'a@a.com',
      role: 'USER',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  //=====================================================//

  it.only('should allow ADMIN to update a user role', async () => {
    await UserService.create(testUser);
    await UserService.create({
      email: 'admin@a.com',
      password: '1234pass',
      roleTitle: 'ADMIN',
    });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'admin@a.com', password: '1234pass' });

    const res = await agent.patch('/api/v1/auth/1').send({
      email: 'a@a.com',
      passwordHash: 'pass1234',
      roleTitle: 'ADMIN',
    });

    expect(res.body).toEqual({
      id: '1',
      email: 'a@a.com',
      role: 'ADMIN',
    });
  });

  //=====================================================//

  afterAll(() => {
    pool.end();
  });
});
