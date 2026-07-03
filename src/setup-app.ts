import express, { Express, Request, Response } from 'express';
import { db } from './db/in-memory.db';
import { HttpStatus } from './core/types/http-statuses';
import { Driver } from './drivers/types/driver';
import { DriverInputDto } from './drivers/dto/driver.input.dto';
import { validateDriverInputDto } from './drivers/validation/driver-input-dto.validation';
import { createErrorMessages } from './core/utils/error.utils';

export const setupApp = (app: Express) => {
  // express.json() парсит JSON из тела запроса и кладёт его в req.body.
  app.use(express.json());

  // Health-check: простой ответ, что сервер жив.
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello world!');
  });

  // Список всех водителей.
  app.get('/drivers', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send(db.drivers);
  });

  // Один водитель по id.
  app.get('/drivers/:id', (req: Request<{ id: string }>, res: Response) => {
    const driver = db.drivers.find((d) => d.id === +req.params.id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
      return;
    }

    res.status(HttpStatus.Ok).send(driver);
  });

  // Создание водителя. Сначала валидируем тело запроса вручную,
  // и только при отсутствии ошибок создаём водителя.
  app.post(
    '/drivers',
    (req: Request<{}, {}, DriverInputDto>, res: Response) => {
      const errors = validateDriverInputDto(req.body);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      const lastDriver = db.drivers[db.drivers.length - 1];

      const newDriver: Driver = {
        id: lastDriver ? lastDriver.id + 1 : 1,
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
    },
  );

  // Тестовый эндпоинт: полностью очищает данные (используется в e2e-тестах).
  app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.drivers = [];
    res.sendStatus(HttpStatus.NoContent);
  });

  return app;
};
