import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';

describe('Driver API body validation check', () => {
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
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  // Оборачивает атрибуты в JSON:API-конверт (для update — с id).
  const wrap = (attributes: object, id?: string) => ({
    data: { type: ResourceType.Drivers, ...(id ? { id } : {}), attributes },
  });

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it(`should not create driver when incorrect body passed; POST /api/drivers`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/api/drivers')
      .send(
        wrap({
          ...correctAttributes,
          name: '   ',
          phoneNumber: '    ',
          email: 'invalid email',
          vehicleMake: '',
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/api/drivers')
      .send(
        wrap({
          ...correctAttributes,
          phoneNumber: '', // пустая строка
          vehicleModel: '', // пустая строка
          vehicleYear: 'year', // не число
          vehicleLicensePlate: '', // пустая строка
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/api/drivers')
      .send(wrap({ ...correctAttributes, name: 'F' })) // слишком короткое
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // Проверяем, что ни один невалидный водитель не создался.
    const driverListResponse = await request(app).get('/api/drivers');
    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await request(app)
      .post('/api/drivers')
      .send(wrap(correctAttributes))
      .expect(HttpStatus.Created);

    const createdId = createdDriver.body.data.id;

    const invalidDataSet1 = await request(app)
      .put(`/api/drivers/${createdId}`)
      .send(
        wrap(
          {
            ...correctAttributes,
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
          },
          createdId,
        ),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`/api/drivers/${createdId}`)
      .send(
        wrap(
          {
            ...correctAttributes,
            phoneNumber: '', // пустая строка
            vehicleModel: '', // пустая строка
            vehicleYear: 'year', // не число
            vehicleLicensePlate: '', // пустая строка
          },
          createdId,
        ),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`/api/drivers/${createdId}`)
      .send(wrap({ ...correctAttributes, name: 'A' }, createdId)) // слишком короткое
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // Данные водителя не должны измениться после невалидных запросов.
    const driverResponse = await request(app).get(`/api/drivers/${createdId}`);

    expect(driverResponse.body).toEqual({
      data: {
        type: ResourceType.Drivers,
        id: createdId,
        attributes: correctAttributes,
      },
    });
  });

  it('should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await request(app)
      .post('/api/drivers')
      .send(wrap(correctAttributes))
      .expect(HttpStatus.Created);

    const createdId = createdDriver.body.data.id;

    await request(app)
      .put(`/api/drivers/${createdId}`)
      .send(
        wrap(
          {
            ...correctAttributes,
            vehicleFeatures: [
              VehicleFeature.ChildSeat,
              'invalid-feature',
              VehicleFeature.WiFi,
            ],
          },
          createdId,
        ),
      )
      .expect(HttpStatus.BadRequest);

    // Данные водителя не должны измениться.
    const driverResponse = await request(app).get(`/api/drivers/${createdId}`);

    expect(driverResponse.body).toEqual({
      data: {
        type: ResourceType.Drivers,
        id: createdId,
        attributes: correctAttributes,
      },
    });
  });
});
