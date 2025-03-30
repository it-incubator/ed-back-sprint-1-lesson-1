import express, { Express, Request, Response } from 'express';
import { db } from './db/in-memory.db';
import { HttpStatus } from './core/types/http-statuses';
import { vehicleInputDtoValidation } from './drivers/validation/vehicleInputDtoValidation';
import { createErrorMessages } from './core/utils/error.utils';
import { Driver } from './drivers/types/driver';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  //--------------------------------
  app.get('/drivers', (req: Request, res: Response) => {
    res.status(200).send(db.drivers);
  });
  app.post('/drivers', (req: Request, res: Response) => {
    const errors = vehicleInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const newDriver: Driver = {
      id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      vehicleYear: req.body.vehicleYear,
      vehicleLicensePlate: req.body.vehicleLicensePlate,
      vehicleDescription: req.body.vehicleDescription,
      vehicleFeatures: req.body.vehicleFeatures,
      createdAt: new Date(),
    };
    db.drivers.push(newDriver);
    res.status(HttpStatus.Created).send(newDriver);
  });
  app.get('/drivers/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
      return;
    }
    res.status(200).send(driver);
  });
  //--------------------------------

  app.get('/testing', (req: Request, res: Response) => {
    res.status(200).send('testing url');
  });
  app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.drivers = [];
    res.sendStatus(HttpStatus.NoContent);
  });
  //--------------------------------

  return app;
};
