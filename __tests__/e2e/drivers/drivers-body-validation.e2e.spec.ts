import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
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

  it(`should not create driver when incorrect body passed; POST /drivers'`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        name: 'A', // too shot
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const driverListResponse = await request(app).get('/drivers');
    expect(driverListResponse.body).toHaveLength(0);
  });

  it('should not update driver when incorrect data passed; PUT /drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/drivers')
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        name: 'A', //too short
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app).get(
      `/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });

  it('should not update driver when incorrect features passed; PUT /drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/drivers')
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature',
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await request(app).get(
      `/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });
});
