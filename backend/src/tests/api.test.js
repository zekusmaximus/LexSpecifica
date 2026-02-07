const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('GET /health', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('POST /api/generate/framework', () => {
    it('should return 400 if worldConcept is missing', async () => {
        const res = await request(app)
            .post('/api/generate/framework')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('World concept is required');
    });
});
