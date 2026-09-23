import jwt from 'jsonwebtoken';

export function signToken({ id, role }) {
  return jwt.sign({ role }, process.env.JWT_SECRET, {
    subject: id,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
