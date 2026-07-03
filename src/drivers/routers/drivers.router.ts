import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Driver } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input.dto';
import { validateDriverInputDto } from '../validation/driver-input-dto.validation';

// Все маршруты, связанные с водителями, вынесены в отдельный роутер.
// В setup-app он подключается по базовому пути '/drivers'.
export const driversRouter = Router({});

driversRouter
  // Список всех водителей.
  .get('', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send(db.drivers);
  })

  // Один водитель по id.
  .get('/:id', (req: Request<{ id: string }>, res: Response) => {
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
  })

  // Создание водителя: сначала валидируем тело, затем создаём.
  .post('', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
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
  })

  // Обновление водителя: проверяем, что он существует, затем валидируем тело.
  .put(
    '/:id',
    (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
      const index = db.drivers.findIndex((d) => d.id === +req.params.id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );
        return;
      }

      const errors = validateDriverInputDto(req.body);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      // Обновляем поля из тела запроса, сохраняя служебные id и createdAt.
      db.drivers[index] = { ...db.drivers[index], ...req.body };

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  // Удаление водителя по id.
  .delete('/:id', (req: Request<{ id: string }>, res: Response) => {
    const index = db.drivers.findIndex((d) => d.id === +req.params.id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
      return;
    }

    db.drivers.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
