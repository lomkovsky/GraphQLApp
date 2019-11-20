import jwt from 'jsonwebtoken';

const getUserId = (request) => {
  const requestToken = request.request.headers.authorization
  if (!requestToken) {
    throw new Error('you need to provide a authorization token!')
  }
  const token = requestToken.slice(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId
};

export { getUserId as default };
