import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MemeAttributes {
  id: number;
  title: string;
  imageUrl: string;    
  userId: number;      
  score: number;       
  createdAt?: Date;
}

interface MemeCreationAttributes extends Optional<MemeAttributes, 'id' | 'score'> {}

class Meme extends Model<MemeAttributes, MemeCreationAttributes> implements MemeAttributes {
  public id!: number;
  public title!: string;
  public imageUrl!: string;
  public userId!: number;
  public score!: number;
  public readonly createdAt!: Date;
}

Meme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false       
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  
  {
    sequelize,
    tableName: 'Memes',
    timestamps: true,
    updatedAt: false,
    indexes: [ { fields: ['score'] } ]
  }
);
export default Meme;