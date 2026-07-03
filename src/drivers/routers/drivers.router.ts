import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Driver } from '../types/driver';
import { DriverCreateInput, DriverUpdateInput } from '../dto/driver.input';
import { DriverListOutput } from '../dto/driver.output';
import { validateDriverAttributes } from '../validation/driver-attributes.validation';
import { mapToDriverOutput } from './mappers/map-driver-to-output';
import { mapToDriverListOutput } from './mappers/map-list-drivers-to-output';

// Все ответы этого роутера — в формате JSON:API (data / type / id / attributes).
export const driversRouter = Router({});

driversRouter
  // Список всех водителей: { meta, data: [...] }.
  .get('', (req: Request, res: Response<DriverListOutput>) => {
    res.status(HttpStatus.Ok).send(mapToDriverListOutput(db.drivers));
  })

  // Один водитель по id: { data: { ... } }.
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

    res.status(HttpStatus.Ok).send(mapToDriverOutput(driver));
  })

  // Создание водителя: валидируем атрибуты, затем создаём.
  .post('', (req: Request<{}, {}, DriverCreateInput>, res: Response) => {
    const attributes = req.body.data.attributes;

    const errors = validateDriverAttributes(attributes);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const lastDriver = db.drivers[db.drivers.length - 1];

    const newDriver: Driver = {
      id: lastDriver ? lastDriver.id + 1 : 1,
      ...attributes,
      createdAt: new Date(),
    };

    db.drivers.push(newDriver);
    res.status(HttpStatus.Created).send(mapToDriverOutput(newDriver));
  })

  // Обновление водителя: проверяем существование, затем валидируем атрибуты.
  .put(
    '/:id',
    (req: Request<{ id: string }, {}, DriverUpdateInput>, res: Response) => {
      const index = db.drivers.findIndex((d) => d.id === +req.params.id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );
        return;
      }

      const attributes = req.body.data.attributes;

      const errors = validateDriverAttributes(attributes);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      // Обновляем поля из attributes, сохраняя служебные id и createdAt.
      db.drivers[index] = { ...db.drivers[index], ...attributes };

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
