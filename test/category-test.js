const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Category = require('../models/category-model');

jest.setTimeout(15000);

describe('Category API - GET endpoints', () => {
  let categoryId;

  beforeEach(async () => {
    const category = new Category({ name: 'Test Category' });
    const saved = await category.save();
    categoryId = saved._id.toString();
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /categories should return 200 and array of categories', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /categories/:id with valid id should return 200 and the category', async () => {
    const res = await request(app).get(`/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', categoryId);
  });

  it('GET /categories/:id with non-existent id should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/categories/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('GET /categories/:id with invalid id should return error status', async () => {
    const res = await request(app).get('/categories/1234');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
