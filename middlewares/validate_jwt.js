import { request, response } from 'express';
import jwt from 'jsonwebtoken';

export const validateJWT = (req = request, res = response, next) => {
  // x-token on "Headers"
  const token = req.header('x-token');

  //   console.log(token);

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'There is no token in the GET request.',
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    // console.log({ uid, name });

    req.uid = uid;
    req.name = name;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
    });
  }

  next();
};
