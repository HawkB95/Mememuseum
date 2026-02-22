import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CommentAttributes {
  id: number;
  text: string;
  userId: number;
  memeId: number;
  createdAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public text!: string;
  public userId!: number;
  public memeId!: number;
  public readonly createdAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,      
      allowNull: false           
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
    tableName: 'Comments',
    timestamps: true,
    updatedAt: false
  }
);

export default Comment;