// Function validator for "express validator(check)"

import moment from 'moment';

export const isDate = (value, { req, location, path }) => {
  //   console.log({ value, req, location, path });

  if (!value) {
    return false;
  }

  const date = moment(value);

  if (date.isValid()) {
    return true;
  } else {
    return false;
  }
};
