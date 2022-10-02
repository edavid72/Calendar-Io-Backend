import { response } from 'express';
import Event from '../models/Event.js';

export const getEvents = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name password');
  res.json({
    ok: true,
    msg: 'Events OK',
    events,
  });
};

export const createEvent = async (req, res = response) => {
  // Check Body(console.log)
  // console.log(req.body);

  const event = new Event(req.body);

  try {
    // add user from body(req.uid)
    event.user = req.uid;

    const eventSave = await event.save();

    res.json({
      ok: true,
      event: eventSave,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      mgs: 'Please contact the administrator.',
    });
  }
};

export const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'This event does not exist for that ID.',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        mag: 'You do not have authentication privileges to be able to edit this event.',
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator.',
    });
  }
};

export const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  // console.log({ eventId, uid });

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'This event does not exist for that ID.',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have authentication privileges to be able to delete this event.',
      });
    }

    const deleteEvent = await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
      deleteEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator.',
    });
  }
};
