import bcrypt from 'bcrypt';
import { sequelize, User, UserSession } from '../models/index.js';
import { sendFailure } from '../utils/apiResponse.js';
import { createAccessToken } from '../utils/jwt.js';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function sendError(response, status, message) {
  return sendFailure(response, { status, message });
}

function getCredentials(body = {}) {
  return {
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
    password: typeof body.password === 'string' ? body.password : '',
  };
}

async function createSession(user, transaction) {
  const accessToken = createAccessToken(user);
  await UserSession.create({
    userId: user.id,
    tokenIdentifier: accessToken.tokenIdentifier,
    expiresAt: accessToken.expiresAt,
  }, { transaction });

  return accessToken;
}

export async function register(request, response) {
  try {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
    const { email, password } = getCredentials(request.body);

    if (!name || !email || !password) {
      return sendError(response, 400, 'Name, email, and password are required.');
    }
    if (password.length < 8) {
      return sendError(response, 400, 'Password must contain at least 8 characters.');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(response, 409, 'An account with this email already exists.');
    }

    const result = await sequelize.transaction(async (transaction) => {
      const user = await User.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, saltRounds),
        role: 'employee',
      }, { transaction });
      const accessToken = await createSession(user, transaction);

      return { user, accessToken };
    });

    return response.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: serializeUser(result.user),
        token: result.accessToken.token,
        expiresAt: result.accessToken.expiresAt,
      },
    });
  } catch (error) {
    return sendError(response, 500, 'Unable to register the user.');
  }
}

export async function login(request, response) {
  try {
    const { email, password } = getCredentials(request.body);

    if (!email || !password) {
      return sendError(response, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ where: { email, isActive: true } });
    const isPasswordValid = user && await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return sendError(response, 401, 'Invalid email or password.');
    }

    const accessToken = await createSession(user);

    return response.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: serializeUser(user),
        token: accessToken.token,
        expiresAt: accessToken.expiresAt,
      },
    });
  } catch (error) {
    return sendError(response, 500, 'Unable to sign in.');
  }
}

export async function logout(request, response) {
  try {
    await UserSession.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: request.auth.userId,
          tokenIdentifier: request.auth.tokenIdentifier,
          revokedAt: null,
        },
      },
    );

    return response.status(200).json({
      success: true,
      message: 'Logout successful.',
      data: null,
    });
  } catch (error) {
    return sendError(response, 500, 'Unable to log out.');
  }
}
