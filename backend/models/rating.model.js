module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rating_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'   // ✅ Maps to actual column name in DB
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'store_id'  // ✅ Maps to actual column name in DB
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    tableName: 'ratings',
    timestamps: true // ✅ Enables createdAt/updatedAt
  });

  return Rating;
};
