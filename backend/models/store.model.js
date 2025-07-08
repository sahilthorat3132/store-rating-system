module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'owner_id'  // ✅ Maps JS `ownerId` to DB column `owner_id`
    }
  }, {
    timestamps: false
  });

  return Store;
};
