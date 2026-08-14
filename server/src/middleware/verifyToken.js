import { Op } from 'sequelize';
import { User, UserSession } from '../models/index.js';
import { sendFailure } from '../utils/apiResponse.js';
import { verifyAccessToken } from '../utils/jwt.js';

function unauthorized(response) {
  return sendFailure(response, {
    status: 401,
    message: 'Authentication is required or the access token is invalid.',
  });
}

export default async function verifyToken(request, response, next) {
  try {
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : null;

    if (!token) {
      return unauthorized(response);
    }

    const payload = verifyAccessToken(token);
    if (!payload.sub || !payload.jti) {
      return unauthorized(response);
    }

    const session = await UserSession.findOne({
      where: {
        userId: payload.sub,
        tokenIdentifier: payload.jti,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    const user = session && await User.findOne({ where: { id: payload.sub, isActive: true } });

    if (!user) {
      return unauthorized(response);
    }

    request.auth = { userId: user.id, tokenIdentifier: payload.jti };
    request.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return next();
  } catch (error) {
    return unauthorized(response);
  }
}
