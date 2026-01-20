export const success = (res, data, message = 'success', status = 200) => {
  return res.status(status).json({
    status: 'success',
    message,
    data
  });
};

export const error = (res, message = 'error', status = 400) => {
  return res.status(status).json({
    status: 'error',
    message
  });
};
