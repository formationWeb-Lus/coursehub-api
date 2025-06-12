const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
jest.setTimeout(15000);


beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Course API', () => {
  it('should return 200 for GET /api/courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toEqual(200);
  }, 10000); // timeout ici aussi
});
