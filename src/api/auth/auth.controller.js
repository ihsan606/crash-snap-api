const { registerSchema } = require('./auth.model');
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


module.exports = {
  register
}