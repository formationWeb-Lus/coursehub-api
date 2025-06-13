const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

jest.setTimeout(15000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Course API', () => {
  it('GET /api/courses should return 200 and a list of courses', async () => {
    const res = await request(app).get('/api/courses?page=1&limit=5');
    expect(res.statusCode).toEqual(200);
    // Si tu as pagination avec un objet contenant un tableau courses
    expect(res.body).toHaveProperty('courses');
    expect(Array.isArray(res.body.courses)).toBe(true);
  }, 10000);
});
