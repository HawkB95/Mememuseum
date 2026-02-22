import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TagAttributes {
  id: number;
  name: string;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: number;
  public name!: string;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'Tags',
    timestamps: false   
  }
);

export default Tag;