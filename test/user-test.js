const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user-model');

jest.setTimeout(15000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe('User API - GET endpoints', () => {
  let userId;

  beforeEach(async () => {
    const user = new User({ username: 'user1', email: 'user1@test.com', password: 'pass123' });
    const saved = await user.save();
    userId = saved._id.toString();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/users should return 200 and array of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).not.toHaveProperty('password');
  });

  it('GET /api/users/:id with valid id should return 200 and the user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', userId);
    expect(res.body).not.toHaveProperty('password');
  });

  it('GET /api/users/:id with non-existent id should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/users/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/users/:id with invalid id should return 400 or higher', async () => {
    const res = await request(app).get('/api/users/1234');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
