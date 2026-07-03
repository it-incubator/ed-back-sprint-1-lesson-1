import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input.dto';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInputDto = {
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

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  it(`should not create driver when incorrect body passed; POST /drivers`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        name: '   ', // пустая строка
        phoneNumber: '    ', // пустая строка
        email: 'invalid email', // неверный формат
        vehicleMake: '', // пустая строка
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // пустая строка
        vehicleModel: '', // пустая строка
        vehicleYear: 'year', // не число
        vehicleLicensePlate: '', // пустая строка
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        name: 'A', // слишком короткое
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // Проверяем, что ни один невалидный водитель не создался.
    const driverListResponse = await request(app).get('/drivers');
    expect(driverListResponse.body).toHaveLength(0);
  });
});
