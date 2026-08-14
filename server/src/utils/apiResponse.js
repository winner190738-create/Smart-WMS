export function sendSuccess(response, { status = 200, message = 'Success', data = null } = {}) {
  return response.status(status).json({ success: true, message, data });
}

export function sendFailure(response, { status = 500, message = 'An unexpected error occurred.', errors = null } = {}) {
  return response.status(status).json({ success: false, message, data: null, ...(errors ? { errors } : {}) });
}
