const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Course = require('../models/course-model');
const User = require('../models/user-model');

jest.setTimeout(20000);

let token;

beforeAll(() => {
  const userPayload = { id: new mongoose.Types.ObjectId().toString(), email: 'test@example.com', role: 'admin' };
  token = jwt.sign(userPayload, process.env.JWT_SECRET || 'tonSecret', { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Courses API', () => {
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
    await Course.deleteMany();
  });

  it('GET /api/courses should return list of courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.courses)).toBe(true);
    expect(res.body.courses.length).toBeGreaterThan(0);
  });

  it('POST /api/courses requires token', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        title: 'New Course',
        description: 'New desc',
        price: 20,
        duration: 40,
        level: 'beginner',
        category: 'web',
        teacherId: new mongoose.Types.ObjectId().toString(),
      });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/courses with token should succeed', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Course',
        description: 'A new course description',
        price: 20.99,
        duration: 40,
        level: 'beginner',
        category: 'programming',
        teacherId: new mongoose.Types.ObjectId().toString(),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Course');
  });

  it('PUT /api/courses/:id with token should update', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Course',
        description: 'Updated desc',
        price: 30,
        duration: 50,
        level: 'beginner',
        category: 'programming',
        teacherId: new mongoose.Types.ObjectId().toString(),
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Course');
  });
});

describe('Users API', () => {
  let userId;

  beforeEach(async () => {
    const user = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'student',
    });
    const saved = await user.save();
    userId = saved._id.toString();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('GET /api/users should return list of users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`); // ✅ Token ajouté ici

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/users requires token', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'New User',
        email: `new${Date.now()}@example.com`,
        password: 'password123',
        role: 'teacher',
      });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/users with token should create user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New User',
        email: `new${Date.now()}@example.com`,
        password: 'password123',
        role: 'teacher',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('New User');
    expect(res.body).not.toHaveProperty('password');
  });

  it('PUT /api/users/:id with token should update user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        email: `updated${Date.now()}@example.com`,
        password: 'newpass123',
        role: 'admin',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });
});
