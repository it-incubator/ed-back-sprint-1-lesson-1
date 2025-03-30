import { Request, Response, Router } from 'express';
import { DriverInputDto } from '../dto/driver.input-dto';
import { vehicleInputDtoValidation } from '../validation/vehicleInputDtoValidation';
import { Driver } from '../types/driver';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { db } from '../../db/in-memory.db';

export const driversRouter = Router({});

driversRouter
  .get('', (req: Request, res: Response) => {
    res.status(200).send(db.drivers);
  })

  .get('/:id', (req: Request, res: Response) => {
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
  })

  .post('', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
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
  })

  .put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.drivers.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );
      return;
    }

    const errors = vehicleInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const driver = db.drivers[index];

    driver.name = req.body.name;
    driver.phoneNumber = req.body.phoneNumber;
    driver.email = req.body.email;
    driver.vehicleMake = req.body.vehicleMake;
    driver.vehicleModel = req.body.vehicleModel;
    driver.vehicleYear = req.body.vehicleYear;
    driver.vehicleLicensePlate = req.body.vehicleLicensePlate;
    driver.vehicleDescription = req.body.vehicleDescription;
    driver.vehicleFeatures = req.body.vehicleFeatures;

    res.sendStatus(HttpStatus.NoContent);
  })

  .delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    //ищет первый элемент, у которого функция внутри возвращает true и возвращает индекс этого элемента в массиве, если id ни у кого не совпал, то findIndex вернёт -1.
    const index = db.drivers.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );
      return;
    }

    db.drivers.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
