const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const User = db.User;
const Store = db.Store;
const Rating = db.Rating;

const dashboard = async (req, res) => {
  try {
    console.log("Logged in admin:", req.user); // Add this for debugging

    const userCount = await User.count();
    console.log("userCount",userCount);
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();
    res.json({ userCount, storeCount, ratingCount });   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
  if (role) where.role = role;

  const order = [[sortBy, sortOrder]];

  try {
    const users = await User.findAll({ where, order });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStores = async (req, res) => {
  const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, attributes: ['rating_value'] }],
      order: [[sortBy, sortOrder]]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating_value);
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : 'No ratings';

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: avg
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getStoreOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role: 'owner' },
      attributes: ['id', 'name', 'email', 'address']
    });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // 1. Check if the owner user exists
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Create the store and assign owner
    const store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    // 3. Update the user role to 'owner' (if not already)
    if (owner.role !== 'owner') {
      owner.role = 'owner';
      await owner.save(); // Save changes to DB
    }

    res.status(201).json({ message: 'Store added and owner updated.', store });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//  Export them correctly
module.exports = {
  dashboard,
  getUsers,
  getStores,
  getStoreOwners,
  createStore,
  createUser,

};
