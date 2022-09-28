import { response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../helpers/jwt.js';

export const createUser = async (req, res = response) => {
  //todo:: Destructuring data sent by the user
  const { email, password } = req.body;

  try {
    //todo:: Validation with use mongo database
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'A user already uses that email, please try another email.',
      });
    }

    // todo:: Create a new user
    user = new User(req.body);

    // todo:: Bcrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // todo:: Save the user on database
    await user.save();

    // todo:: Generate Token
    const token = await generateToken(user.id, user.name);

    //! ~ ~ Error management: From Middleware(field_validator.js) ~ ~

    // todo:: Successful Process
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator.',
    });
  }
};

export const loginUser = async (req, res = response) => {
  // todo:: Destructuring data sent by the user
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'The user with that email does not exist in our database, I invite you to register',
      });
    }

    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Incorrect password',
      });
    }

    // todo:: Generate Token
    const token = await generateToken(user.id, user.name);

    // todo:: Successful Process
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator.',
    });
  }
};

export const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generate Token
  const token = await generateToken(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};
