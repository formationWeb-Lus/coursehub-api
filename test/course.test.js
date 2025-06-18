const request = require('supertest');
const app = require('../server');
const Course = require('../models/course-model');
const mongoose = require('mongoose');
jest.setTimeout(15000); // 10 seconds


describe('Courses API GET endpoints', () => {
  let courseId;

  beforeEach(async () => {
    const course = new Course({
      title: 'Test Course',
      description: 'Description test',
      price: 10,
      duration: 30,
      level: 'beginner',
      category: 'programming',
      teacherId: new mongoose.Types.ObjectId(),
    });
    const saved = await course.save();
    courseId = saved._id.toString();
  });

  afterEach(async () => {
    await Course.deleteMany({});
  });

  it('GET /api/courses should return paginated courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.courses)).toBe(true);
  });

  it('GET /api/courses/:id with valid id should return the course', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(courseId);
  });

  it('GET /api/courses/:id with non-existent id should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/courses/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/courses/:id with invalid id should return 400', async () => {
    const res = await request(app).get('/api/courses/1234');
    expect(res.statusCode).toBe(400);
  });
});
