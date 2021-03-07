import User from '../models/user';
import jwt from 'jsonwebtoken';
export const showMessage = (req, res) => {
  res.status(200).send(`${req.params.message}`);
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) return res.status(400).send('Name is required');
  if (!password || password.length < 6)
    return res
      .status(400)
      .send('Password is required and should be min 6 characters long');
  let userExist = await User.findOne({ email }).exec();

  if (userExist) return res.status(400).send('Email is taken');

  const user = new User(req.body);

  try {
    await user.save();
    console.log('USER CREATED', user);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).send('Error.Try again');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) res.status(400).send('User with that email not found');

    user.comparePassword(password, (err, match) => {
      if (!match || err) return res.status(400).send('Invalid password');

      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id:user.stripe_account_id,
          stripe_seller:user.stripe_seller,
          stripeSession:user.stripeSession,
        },
      });
    });
  } catch (err) {
    res.status(400).send('SignIn failed.');
  }
};
