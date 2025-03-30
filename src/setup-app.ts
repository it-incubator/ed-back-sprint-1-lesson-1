import express, { Express, Request, Response } from 'express';

export const setupApp = (app: Express) => {
  app.use(express.json()); //middleware express.json() парсит JSON в теле запроса и добавляет его как объект в свойство body запроса (req.body.).

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world!');
  });

  return app;
};
