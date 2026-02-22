import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface VoteAttributes {
  id: number;
  value: number;   
  userId: number;
  memeId: number;
}

interface VoteCreationAttributes extends Optional<VoteAttributes, 'id'> {}

class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  public id!: number;
  public value!: number;
  public userId!: number;
  public memeId!: number;
}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, -1]]
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'Votes',
    timestamps: false,
    indexes: [
      {
        unique: true,               
        fields: ['userId', 'memeId']
      }
    ]
  }
);

export default Vote;