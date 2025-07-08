const db = require('../models');
const Rating = db.Rating;
const Store = db.Store;

exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating_value } = req.body;

    const existing = await Rating.findOne({
      where: { storeId: storeId, userId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Rating already exists. Use update.' });
    }

    const rating = await Rating.create({
      userId: req.user.id,    
      storeId: storeId,       
      rating_value
    });

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating_value } = req.body;

    const rating = await Rating.findOne({
      where: { user_id: req.user.id, store_id: storeId }
    });

    if (!rating) return res.status(404).json({ message: 'Rating not found' });

    rating.rating_value = rating_value;
    await rating.save();

    res.json({ message: 'Rating updated', rating });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.json(ratings.map(r => ({
      storeId: r.storeId,
      storeName: r.Store.name,
      rating_value: r.rating_value
    })));
  } catch (err) {
    console.error("Error in getMyRatings:", err);
    res.status(500).json({ message: err.message });
  }
};
