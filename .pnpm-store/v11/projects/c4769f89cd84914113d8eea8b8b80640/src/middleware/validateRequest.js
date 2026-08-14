import { validationResult } from 'express-validator';
import { sendFailure } from '../utils/apiResponse.js';

export default function validateRequest(request, response, next) {
  const result = validationResult(request);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return sendFailure(response, {
    status: 422,
    message: 'Validation failed.',
    errors,
  });
}
