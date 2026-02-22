import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class MemeTag extends Model {}

MemeTag.init(
  {
    memeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Memes',   
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'MemeTags',
    timestamps: false
  }
);

export default MemeTag;