/*
User Routes / Events
host + /api/events
*/

import { Router } from 'express';
import { validateJWT } from '../middlewares/validate_jwt.js';
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../controllers/events.js';
import { check } from 'express-validator';
import { fieldValidator } from '../middlewares/field_validator.js';
import { isDate } from '../helpers/idDate.js';

const eventsRouter = Router();

// * Get events
eventsRouter.get('/', validateJWT, getEvents);

// * Create a new event
eventsRouter.post(
  '/',
  [
    check('title', 'Title is a required character').not().isEmpty(),
    check('start', 'The start date is required').custom(isDate),
    check('end', 'The end date is required').custom(isDate),
    fieldValidator,
  ],
  validateJWT,
  createEvent
);

// * Update an event
eventsRouter.put('/:id', validateJWT, updateEvent);

// * Delete an event
eventsRouter.delete('/:id', validateJWT, deleteEvent);

export default eventsRouter;
