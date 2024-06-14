const admin = require('../firebase-admin-config');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).send({ error: true, message: 'A token is required for authentication' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log(req.user)
    next();
  } catch (error) {
    return res.status(401).send({ error: true, message: 'Invalid Token, Please Relogin' });
  }
};

module.exports = verifyToken;
