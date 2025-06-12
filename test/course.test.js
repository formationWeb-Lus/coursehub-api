const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Course = require('../models/course-model');

jest.setTimeout(15000); // extended timeout if needed

describe('Course API - GET endpoints', () => {
  let courseId;

  beforeEach(async () => {
  const course = new Course({
    title: 'Test course',
    description: 'Description of course',
    price: 15,
    duration: 600,       // chaîne, pas nombre
    level: 'beginner',          // en minuscules pour l’enum
    category: 'Web Development',
    teacherId: new mongoose.Types.ObjectId(), // requis
  });
  const saved = await course.save();
  courseId = saved._id.toString();
});

  afterEach(async () => {
    await Course.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/courses should return 200 and an array of courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/courses/:id with valid id should return 200 and the course object', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', courseId);
    expect(res.body).toHaveProperty('title', 'Test course');
  });

  it('GET /api/courses/:id with valid but non-existent id should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/courses/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Course not found');
  });

  it('GET /api/courses/:id with malformed id should return an error status', async () => {
    const malformedId = '1234';
    const res = await request(app).get(`/api/courses/${malformedId}`);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
