import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  it('should create driver; POST /drivers', async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
      name: 'Valentin',
      phoneNumber: '123-456-7890',
      email: 'valentin@example.com',
    };

    await request(app)
      .post('/drivers')
      .send(newDriver)
      .expect(HttpStatus.Created);
  });

  it('should return drivers list; GET /drivers', async () => {
    await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver2' })
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get('/drivers')
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/drivers/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });
});
