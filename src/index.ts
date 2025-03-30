import express from 'express';
import { setupApp } from './setup-app';

// создание приложения
const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

// ф-ия listen - запускает сервер и начинает прослушивать входящие запросы на указанном порту.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
