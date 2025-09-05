import request from 'supertest';
import { app } from '../app';

describe('API', () => {
  let token: string;
  beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({ email: 'slp@example.com', password: 'password' });
    token = res.body.token;
  });

  it('health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('clients CRUD minimal', async () => {
    const create = await request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Test',
        lastName: 'Client',
        dateOfBirth: '2015-01-01',
        parentGuardian: 'Parent',
        consentOnFile: true,
        contactInfo: {},
        targetSounds: [],
        treatmentGoals: []
      });
    expect(create.status).toBe(201);
    const id = create.body.id as string;

    const list = await request(app)
      .get('/clients')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const byId = await request(app)
      .get(`/clients/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(byId.status).toBe(200);
    expect(byId.body.id).toBe(id);
  });
});


