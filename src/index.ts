import { Request, Response, Router } from 'express';
import routes from './routes';
import config from './config/config';
import seedDatabase from './db/seeding';
const express = require('express')
const app = express()
const port = config.port

app.use(express.json());
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/scripts/seed', (req: Request, res: Response) => {
  res.send(seedDatabase())
})


app.listen(port, () => {
  console.log(`Initializing app using Express listening on port ${port}`)
})