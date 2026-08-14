import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret === 'replace_with_a_long_random_secret') {
    throw new Error('JWT_SECRET must be configured before authentication can be used.');
  }

  return secret;
}

export function createAccessToken(user) {
  const tokenIdentifier = randomUUID();
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: tokenIdentifier,
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  );
  const payload = jwt.decode(token);

  if (!payload || typeof payload === 'string' || typeof payload.exp !== 'number') {
    throw new Error('Unable to determine the access token expiration time.');
  }

  return {
    token,
    tokenIdentifier,
    expiresAt: new Date(payload.exp * 1000),
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}
