import sequelize from '../config/database';
import User from './Users';
import Meme from './Meme';
import Tag from './Tag';
import MemeTag from './MemeTag';
import Vote from './Vote';
import Comment from './Comment';

// =====================
// RELAZIONI TRA ENTITÀ
// =====================

// User <-> Meme | OneToMany
User.hasMany(Meme, { foreignKey: 'userId', as: 'memes' });
Meme.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Meme <-> Tag | ManyToMany
Meme.belongsToMany(Tag, { through: MemeTag, foreignKey: 'memeId', as: 'tags' });
Tag.belongsToMany(Meme, { through: MemeTag, foreignKey: 'tagId', as: 'memes' });

// User <-> Vote | OneToMany
User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'voter' });

// Meme <-> Vote | OneToMany
Meme.hasMany(Vote, { foreignKey: 'memeId', as: 'votes' });
Vote.belongsTo(Meme, { foreignKey: 'memeId', as: 'meme' });

// User <-> Comment | OneToMany
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Meme <-> Comment | OneToMany
Meme.hasMany(Comment, { foreignKey: 'memeId', as: 'comments' });
Comment.belongsTo(Meme, { foreignKey: 'memeId', as: 'meme' });

export { sequelize, User, Meme, Tag, MemeTag, Vote, Comment };