const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Authenticate DB connection
sequelize.authenticate()
  .then(() => {
    console.log(' Database connected successfully!');
  })
  .catch(err => {
    console.error(' Unable to connect to the database:', err);
  });

// Models
db.User = require('./user.model')(sequelize, DataTypes);
db.Store = require('./store.model')(sequelize, DataTypes);
db.Rating = require('./rating.model')(sequelize, DataTypes);

// Associations

// 🔗 User and Rating (One-to-Many)
db.User.hasMany(db.Rating, { foreignKey: 'userId' });
db.Rating.belongsTo(db.User, { foreignKey: 'userId' });

// 🔗 Store and Rating (One-to-Many)
db.Store.hasMany(db.Rating, { foreignKey: 'storeId' });
db.Rating.belongsTo(db.Store, { foreignKey: 'storeId' });

// 🔗 User and Store (One-to-Many, user is the owner)
db.User.hasMany(db.Store, { foreignKey: 'ownerId' });
db.Store.belongsTo(db.User, { foreignKey: 'ownerId' });

module.exports = db;
