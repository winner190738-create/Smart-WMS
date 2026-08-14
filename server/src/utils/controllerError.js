import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';
import { sendFailure } from './apiResponse.js';

export default function handleControllerError(response, error, fallbackMessage) {
  if (error instanceof UniqueConstraintError) {
    return sendFailure(response, { status: 409, message: 'A record with this value already exists.' });
  }
  if (error instanceof ForeignKeyConstraintError) {
    return sendFailure(response, { status: 409, message: 'This record is referenced by another record.' });
  }
  if (error instanceof ValidationError) {
    return sendFailure(response, {
      status: 400,
      message: 'The submitted data is invalid.',
      errors: error.errors.map((item) => ({ field: item.path, message: item.message })),
    });
  }

  return sendFailure(response, { status: 500, message: fallbackMessage });
}
