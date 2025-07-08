module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { len: [2, 60] }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(400)
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'owner'),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  // ✅ Add associations here
  User.associate = (models) => {
    User.hasMany(models.Store, { foreignKey: 'ownerId' }); // A user (owner) can have many stores
    User.hasMany(models.Rating, { foreignKey: 'userId' }); // A user can give many ratings
  };

  return User;
};
