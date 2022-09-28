import express from 'express';
import env from 'dotenv';
import cors from 'cors';

import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';

import { dbConnection } from './database/config.js';

env.config();

// Create the server express
const app = express();

// Connection to our database
dbConnection();

// CORS
app.use(cors());

// Public Directory
app.use(express.static('public'));

// Reading and parsing the body
app.use(express.json());

// Routes
// todo:: auth: create_user, login_user, token
app.use('/api/auth', authRouter);
// todo:: CRUD: events
app.use('/api/events', eventsRouter);

// Listen requests
app.listen(process.env.PORT, () => {
  console.log(`Server is running in PORT: ${process.env.PORT}`);
});

export default app;
