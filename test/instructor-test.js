const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Instructor = require('../models/instructor-model');

jest.setTimeout(15000);

describe('Instructor API - GET endpoints', () => {
  let instructorId;

  beforeEach(async () => {
    const instructor = new Instructor({ name: 'Jean Dupont', bio: 'Prof sympa' });
    const saved = await instructor.save();
    instructorId = saved._id.toString();
  });

  afterEach(async () => {
    await Instructor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /instructors should return 200 and array of instructors', async () => {
    const res = await request(app).get('/instructors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /instructors/:id with valid id should return 200 and the instructor', async () => {
    const res = await request(app).get(`/instructors/${instructorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', instructorId);
  });

  it('GET /instructors/:id with non-existent id should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/instructors/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('GET /instructors/:id with invalid id should return error status', async () => {
    const res = await request(app).get('/instructors/1234');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
