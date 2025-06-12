const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Course = require('../models/course-model');

jest.setTimeout(15000);

describe('Course API JWT Protection and Validation', () => {
  let token;
  let courseId;

  beforeAll(() => {
    const userPayload = { id: new mongoose.Types.ObjectId().toString(), email: 'testuser@example.com' };
    const secret = process.env.JWT_SECRET || 'tonSecret';
    token = jwt.sign(userPayload, secret, { expiresIn: '1h' });
  });

  beforeEach(async () => {
    const course = new Course({
      title: 'Test Course',
      description: 'Testing JWT protection',
      price: 15,
      teacherId: new mongoose.Types.ObjectId(),
      duration: 600,
      category: 'Développement Web',
      image: 'https://example.com/image.png',
      level: 'intermediate'
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

  it('POST /api/courses with valid token should succeed', async () => {
    const newCourseData = {
      title: 'Secure Course',
      description: 'Created with valid JWT token',
      price: 30,
      teacherId: new mongoose.Types.ObjectId().toString(),
      duration: 60,
      category: 'Test Category',
      level: 'beginner'
    };

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(newCourseData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Secure Course');
  });

  it('POST /api/courses with invalid data should return 400', async () => {
    const invalidCourseData = {
      title: '',  // empty title
      price: 'not-a-number',
      teacherId: 'invalid-id',
      duration: -5
    };

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidCourseData);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('PUT /api/courses/:id with valid token should succeed', async () => {
    const updatedCourseData = {
      title: 'Updated Secure Course',
      description: 'Updated description',
      price: 35,
      duration: 75,
      category: 'Updated Category',
      level: 'advanced',
      teacherId: new mongoose.Types.ObjectId().toString()
    };

    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedCourseData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Secure Course');
  });

  it('PUT /api/courses/:id with invalid data should return 400', async () => {
    const invalidUpdateData = {
      title: '',
      price: 'NaN',
      teacherId: 'invalid-id'
    };

    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUpdateData);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/courses without token should return 401', async () => {
    const newCourseData = {
      title: 'No Token Course',
      description: 'Should fail',
      price: 10,
      teacherId: new mongoose.Types.ObjectId().toString(),
      duration: 45,
      category: 'NoAuth',
      level: 'beginner'
    };

    const res = await request(app)
      .post('/api/courses')
      .send(newCourseData);

    expect(res.statusCode).toBe(401);
  });

  it('DELETE /api/courses/:id with valid token should succeed', async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Course deleted');
  });

  it('DELETE /api/courses/:id without token should return 401', async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`);

    expect(res.statusCode).toBe(401);
  });
});
