import { Request, Response } from 'express';
import config from './config/config';
const express = require('express')
const app = express()
const port = config.port

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Initializing app using Express listening on port ${port}`)
})