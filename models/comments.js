'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Users, { foreignKey: 'user_id', sourceKey: 'id' });
      Comments.belongsTo(models.Users, { foreignKey: 'profile_img_url', sourceKey: 'img_url' });
      Comments.belongsTo(models.Posts, { foreignKey: 'post_id', sourceKey: 'id' });
      // define association here
    }
  }
  Comments.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true
    },
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comments',
    charset: 'utf8',
  });
  return Comments;
};