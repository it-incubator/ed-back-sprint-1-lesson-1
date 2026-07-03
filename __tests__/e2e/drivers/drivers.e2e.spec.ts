import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';
import {
  DriverCreateInput,
  DriverUpdateInput,
} from '../../../src/drivers/dto/driver.input';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const correctAttributes: DriverAttributes = {
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

  // Оборачивает атрибуты в JSON:API-конверт создания.
  const createBody = (
    attributes: DriverAttributes = correctAttributes,
  ): DriverCreateInput => ({
    data: { type: ResourceType.Drivers, attributes },
  });

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create driver; POST /api/drivers', async () => {
    await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Fedor' }))
      .expect(HttpStatus.Created);
  });

  it('should return drivers list; GET /api/drivers', async () => {
    await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Another Driver1' }))
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Another Driver2' }))
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get('/api/drivers')
      .expect(HttpStatus.Ok);

    // В JSON:API список ресурсов лежит в поле data.
    expect(driverListResponse.body.data).toBeInstanceOf(Array);
    expect(driverListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Another Driver3' }))
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/drivers/${createResponse.body.data.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should update driver; PUT /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Another Driver4' }))
      .expect(HttpStatus.Created);

    const createdId = createResponse.body.data.id;

    const updateAttributes: DriverAttributes = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    const updateBody: DriverUpdateInput = {
      data: {
        type: ResourceType.Drivers,
        id: createdId,
        attributes: updateAttributes,
      },
    };

    await request(app)
      .put(`/api/drivers/${createdId}`)
      .send(updateBody)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(`/api/drivers/${createdId}`);

    expect(driverResponse.body).toEqual({
      data: {
        type: ResourceType.Drivers,
        id: createdId,
        attributes: updateAttributes,
      },
    });
  });

  it('should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .send(createBody({ ...correctAttributes, name: 'Another Driver5' }))
      .expect(HttpStatus.Created);

    const createdId = createResponse.body.data.id;

    await request(app)
      .delete(`/api/drivers/${createdId}`)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`/api/drivers/${createdId}`)
      .expect(HttpStatus.NotFound);
  });
});
