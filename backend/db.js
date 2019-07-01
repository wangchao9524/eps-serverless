const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const DepartmentModel = require('./models/department');
const NodeModel = require('./models/node');
const SecurityRoleModel = require('./models/securityrole');
const AchievementModel = require('./models/achievement');
const AchievementTransactionModel = require('./models/achievement_transaction');
const PointItemModel = require('./models/point_item');
const PointTransactionModel = require('./models/point_transaction');
const UserAchievementProgressModel = require('./models/user_achievement_progress');
const MetricsModel = require('./models/metrics');
const PointPoolModel = require('./models/point_pool');
const SessionModel = require('./models/session');
const LikeModel = require('./models/like');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 20000,
      idle: 10000
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
)
const User = UserModel(sequelize, Sequelize);
const Department = DepartmentModel(sequelize, Sequelize);
const Node = NodeModel(sequelize, Sequelize);
const SecurityRole = SecurityRoleModel(sequelize, Sequelize);
const Achievement = AchievementModel(sequelize, Sequelize);
const AchievementTransaction = AchievementTransactionModel(sequelize, Sequelize);
const PointItem = PointItemModel(sequelize, Sequelize);
const PointTransaction = PointTransactionModel(sequelize, Sequelize);
const UserAchievementProgress = UserAchievementProgressModel(sequelize, Sequelize);
const Metrics = MetricsModel(sequelize, Sequelize);
const PointPool = PointPoolModel(sequelize, Sequelize);
const Session = SessionModel(sequelize, Sequelize);
const Like=LikeModel(sequelize,Sequelize)
const Models = {
  User,
  Department,
  Node,
  SecurityRole,
  Achievement,
  AchievementTransaction,
  PointItem,
  PointTransaction,
  UserAchievementProgress,
  Metrics,
  PointPool,
  Session,
  Like
};

const connection = {}

module.exports = async () => {
  if (connection.isConnected) {
    console.log('=> Using existing connection.')
    return Models
  }

  await sequelize.sync()
  await sequelize.authenticate()
  connection.isConnected = true
  console.log('=> Created a new connection.')
  return Models
}
