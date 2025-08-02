import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Please enter all the fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Login user 
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter all the fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
       return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
    

};

// Get user info 
const getUserInfo = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
         
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
};

export { registerUser, loginUser, getUserInfo, generateToken };
