const { registerSchema } = require('./auth.model');
const authService = require('./auth.service');

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details);

  try {
    const user = await authService.registerUser(req.body.email, req.body.password, req.body.name);
    res.status(201).send({ uid: user.uid, email: user.email, name: user.displayName });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
    register
}