import express from 'express';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import pontoRouter from './routes/pontoRoutes.js';
import funcionarioRouter from './routes/funcionarioRoutes.js';
import conversorRouter from './routes/conversorRoutes.js';
import importRouter from './routes/importFuncionarios.js';
const swaggerFile = JSON.parse(readFileSync('./src/swagger.json', 'utf8'));
const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(userRouter);
app.use(pontoRouter);
app.use(funcionarioRouter);
app.use(conversorRouter);
app.use(importRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
