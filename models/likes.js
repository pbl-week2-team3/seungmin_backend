'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Likes.belongsTo(models.Users, { foreignKey: 'user_id', sourceKey: 'id' });
      Likes.belongsTo(models.Posts, { foreignKey: 'post_id', sourceKey: 'id' });
    }
  }
  Likes.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};