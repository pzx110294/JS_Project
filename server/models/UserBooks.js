module.exports = (sequelize, DataTypes) => {
  const UserBook = sequelize.define('UserBook', {
    status: {
      type: DataTypes.ENUM('to read', 'reading', 'finished'),
        allowNull: false
    }
  }, {
    timestamps: true
  });
  return UserBook;
};