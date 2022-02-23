'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Posts.belongsTo(models.Users, { foreignKey: 'user_id', sourceKey: 'id' });
      // define association here
    }
  }
  Posts.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    content: DataTypes.STRING,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
    charset: 'utf8',
  });
  return Posts;
};