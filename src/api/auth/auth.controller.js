const FirebaseAuthError = require('../../utils/firebase-auth-error');
const { registerSchema, loginSchema } = require('./auth.model');
const authService = require('./auth.service');

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(
    { error: true, message: error.details[0].message }

  );

  try {
    await authService.registerUser(req.body.email, req.body.password, req.body.name);
    res.status(201).json({ error: false, message: 'User Created' });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(
    { error: true, message: error.details[0].message }
  );

  try {
    const userResponse = await authService.loginUser(req.body.email, req.body.password, req.body.name);
    res.status(200).json({
      error: false,
      message: 'success',
      loginResult: userResponse
    });
  } catch (error) {

    if (error.message) {
      const firebaseError = new FirebaseAuthError(error.message);
      return res.status(firebaseError.statusCode).json(firebaseError.toJSON());
    }

  }
}


module.exports = {
  register,
  login
}