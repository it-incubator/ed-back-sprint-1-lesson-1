import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';

// Служебный роутер для тестов. Подключается по базовому пути '/testing'.
export const testingRouter = Router({});

// Полностью очищает данные (используется в e2e-тестах перед прогоном).
testingRouter.delete('/all-data', (req: Request, res: Response) => {
  db.drivers = [];
  res.sendStatus(HttpStatus.NoContent);
});
