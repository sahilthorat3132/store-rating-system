const db = require('../models');
const { Op } = require('sequelize');
const Store = db.Store;
const Rating = db.Rating;
const User = db.User;

exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      whereClause.address = { [Op.like]: `%${address}%` };
    }

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          attributes: ['rating_value']
        }
      ]
    });

    const storeList = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating_value);
      const avgRating =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : 'No ratings';
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avgRating
      };
    });

    res.json(storeList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getStoreRatingsForOwner = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['name', 'email'] }]
        }
      ]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating_value);
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : 'No ratings';

      return {
        store: store.name,
        averageRating: avg,
        ratedBy: store.Ratings.map(r => ({
          user: r.User.name,
          rating: r.rating_value
        }))
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRatingsByOwner = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['name', 'email'] }]
        }
      ]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating_value);
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : 'No ratings';

      return {
        store: store.name,
        averageRating: avg,
        ratedBy: store.Ratings.map(r => ({
          user: r.User.name,
          rating: r.rating_value
        }))
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
