import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';

// Register is used to register the user
const register = async (req, res) => {
  const { name, email, role, password, instrument } = req.body;

  console.log(
    `name=${name}, email=${email}, role=${role}, password=${password} instrument=${instrument}`
  );

  if (!name || !email || !role || !password || !instrument) {
    throw new BadRequestError('please provide all fields.');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use.');
  }

  const user = await User.create({ name, email, role, password, instrument });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      instrument: user.instrument,
    },
    token,
  });
};

// Login is used to login the user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all fields.');
  }
  const user = await User.findOne({ email }).select('+password');
  console.log('user.name', user.name);
  if (!user) {
    throw new UnAuthenticatedError('Invalid email or password.');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid email or password.');
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      teacher: user.teacher,
      instrument: user.instrument,
    },
    token,
  });
};

// Update user is used to update the user's email and name
const updateUser = async (req, res) => {
  console.log('req.body', req.body);
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError('Please provide all fields.');
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

// getProfileData is used to get the user's email and name
const getProfileData = async (req, res) => {
  console.log(`getting current user from the database`);
  const user = await User.findOne({ _id: req.query.userId });
  res.status(StatusCodes.OK).json({ user });
};

// Logout the user
const logout = async (_, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { register, login, updateUser, getProfileData, logout };
