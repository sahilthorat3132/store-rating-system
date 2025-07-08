const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.User;

exports.register = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    //  Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: 'user'
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("token:", token);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
