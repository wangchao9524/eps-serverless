const SqlModel = require('../db');
const Models = SqlModel().Models;

const sqlAchievementModel = Models.Achievement;
const sqlAchievementTransactionModel = Models.AchievementTransaction;
const sqlUserAchievementProgressModel = Models.UserAchievementProgress;
const sqlUserModel = Models.User;
const ctrlUser = require('./user.controller');

const componentName = 'achievement.controller';

/*module.exports.getAchievements = (req, res, next) =>{
  //console.log('req.id:' + req.id);
  //console.log(req);

  sqlAchievementModel.findAll({
    attributes: ['id','name','description','status','cost'],
  })
    .then(achievements => {
      return res.status(200).json({ status: true, achievements : achievements});
    })
    .catch(err => {
      console.log('Database error');
      console.log(err);
      return res.status(500).json({ status: false, message : err});
    });
};*/

/*module.exports.getAchievementById = (req, res, next) =>{

  console.log('getAchievementById req.achievementId:');
  console.log(req.body.achievementId);
  console.log(req.body);

  sqlAchievementModel.findOne({
    attributes: ['id','name','description','status','cost'],
    where: {
      id: req.body.achievementId,
    }
  })
    .then(achievement => {
      if(!achievement) {
        return res.status(404).json({ status: false, message: 'Achievement record not found.' });
      } else {
        return res.status(200).json({ status: true, achievement : achievement });
      }
    })
    .catch(err => {
      console.log('Database error');
      console.log(err);
      return res.status(500).json({ status: false, message : err});
    });

};*/

/*module.exports.getAchievementTransactions = (req, res, next) =>{
  //console.log('req.id:' + req.id);
  //console.log(req);

  sqlAchievementTransactionModel.findAll()
    .then(achievementTransactions => {
      return res.status(200).json({ status: true, achievementTransactions : achievementTransactions });
    });
};*/

/*
module.exports.getAchievementTransactionById = (req, res, next) =>{

  console.log('getAchievementTransactionById req.achievementTransactionId:');
  console.log(req.body.achievementTransactionId);
  console.log(req.body);

  sqlAchievementTransactionModel.findOne({
    attributes: ['id','type', 'amount', 'userAchievementId', 'description'],
    where: {
      id: req.body.achievementTransactionId,
    }
  })
    .then(achievementTransaction => {
      if(!achievementTransaction) {
        return res.status(404).json({ status: false, message: 'Achievement Transaction record not found.' });
      } else {
        return res.status(200).json({ status: true, achievementTransaction : achievementTransaction});
      }
    });

};
*/

/*
module.exports.getUserAchievementProgress = (req, res, next) =>{
  sqlUserAchievementProgressModel.findAll({
    attributes: ['id','userId', 'achievementId', 'goalProgress', 'status'],
  })
    .then(userAchievementProgress => {
      return res.status(200).json({ status: true, userAchievementProgress : userAchievementProgress });
    })
    .catch(err => {
      console.log('Database error');
      console.log(err);
      return res.status(500).json({ status: false, message : err});
    });
};
*/

/*module.exports.getUserAchievementProgressById = (req, res, next) =>{

  console.log('getUserAchievementProgressById req.userAchievementProgressId:');
  console.log(req.body.userAchievementProgressId);
  console.log(req.body);

  sqlUserAchievementProgressModel.findOne({
    attributes: ['id','userId', 'achievementId', 'goalProgress', 'status'],
    where: {
      id: req.body.userAchievementProgressId,
    }
  })
    .then(userAchievementProgress => {
      if(!userAchievementProgress) {
        return res.status(404).json({ status: false, message: 'User Achievement Progress record not found.' });
      } else {
        return res.status(200).json({ status: true, userAchievementProgress : userAchievementProgress});
      }
    });
};*/

/*module.exports.getUserAchievementProgressByUserId = (req, res, next) =>{

  console.log('getUserAchievementProgressByUserId req.userId:');
  console.log(req.body.userId);
  console.log(req.body);

  return SqlModel.sequelize.query(("SELECT `id`, `user_id`, `achievement_id`, `goalProgress`, `status` " +
    "FROM `user_achievement_progress` " +
    "WHERE `user_achievement_progress`.`user_id` = " + req.body.userId), { type: SqlModel.sequelize.QueryTypes.SELECT})
    .then(userAchievementProgress => {
      if(!userAchievementProgress) {
        console.log('getUserAchievementProgressByUserId Failure. User Achievement Progress not found for specified User Id.');
        return res.status(404).json({ status: false, message: 'User Achievement Progress not found for specified User Id.' });
      } else {
        console.log('getUserAchievementProgressByUserId Success. User Achievement Progress for specified User Id found');
        return res.status(200).json({ status: true, userAchievementProgress : userAchievementProgress});
      }
    })
    .catch(err => {
      console.log('Database error');
      return res.status(500).json({ status: false, message: err});
    });
};*/

const getUserAchievementsByUserId = function(userId) {
  const functionName = 'getUserAchievementsByUserId';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  console.log(`${functionFullName}: userId: ${userId}`);

  const sequelize = SqlModel().sequelize;
  return sequelize.query("" +
    "SELECT `user_achievement_progress`.`id` AS `achievementProgressId`, `user_achievement_progress`.`user_id` AS `achievementProgressUserId`, " +
    "`user_achievement_progress`.`achievement_id` AS `achievementProgressAchievementId`, `user_achievement_progress`.`goalProgress` AS `achievementProgressGoalProgress`, " +
    "`user_achievement_progress`.`status` AS `achievementProgressStatus`, " +
    "`achievement`.`id` AS `achievementId`, `achievement`.`name` AS `achievementName`, `achievement`.`description` AS `achievementDescription`, " +
    "`achievement`.`status` AS `achievementStatus`, `achievement`.`cost` AS `achievementCost` " +
    "FROM `user_achievement_progress` " +
    "JOIN `achievement` ON `user_achievement_progress`.`achievement_id` = `achievement`.`id` " +
    "WHERE `user_achievement_progress`.`user_id` = " + userId + " " ,
    {type: sequelize.QueryTypes.SELECT})
    .then(userAchievements => {
      if(!userAchievements) {
        console.log(`${functionFullName}: Records not found`);
        return {status: 404, message: 'User Achievements not found.'};
      } else {
        console.log(`${functionFullName}: User Achievements retrieved successfully`);
        console.log(userAchievements);
        return {status: 200, userAchievements: userAchievements };
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: database error`);
      console.log(err);
      return {status: 500, message: err };
    });
};

module.exports.getUserAchievementsByUserId = getUserAchievementsByUserId;


const newAchievementTransaction = function(userAchievementId, amount, type, description) {
  const functionName = 'newAchievementTransaction';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  // Create New Transaction
  return sqlAchievementTransactionModel.create({
    type: type,
    amount: amount,
    description: description,
    userAchievementId: userAchievementId
  })
    .then(() => {
      console.log(`${functionFullName}: New achievement transaction created successfully`);
      return {status: true, message: 'New achievement transaction created successfully'};
    })
    .catch( err => {
      console.log(`${functionFullName}: Error creating new achievement transaction`);
      console.log(err);
      return {status: false, message: err};
    });
};


const addPointsToAchievementProgress = function (achievementProgressId, amount) {
  const functionName = 'addPointsToAchievementProgress';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  return getAchievementProgressById(achievementProgressId)
    .then( data => {
      if (data.status !== true) {
        console.log(`${functionFullName}: Error retrieving User/Achievement Progress`);
        console.log(data.status);
        return {status: false, message: data.status};
      } else {
        console.log(`${functionFullName}: Success retrieving User/Achievement Progress`);
        const achievementProgress = data.achievementProgress;

        console.log(`${functionFullName}: id: ${achievementProgress.id}`);
        console.log(`${functionFullName}: user_id: ${achievementProgress.userId}`);
        console.log(`${functionFullName}: achievement_id: ${achievementProgress.achievementId}`);
        console.log(`${functionFullName}: goalProgress: ${achievementProgress.goalProgress}`);
        console.log(`${functionFullName}: status: ${achievementProgress.status}`);
        console.log(`${functionFullName}: amount to add: ${amount}`);

        return getAchievementById(achievementProgress.achievementId)
          .then(data => {
            if (data.status === false) {
              console.log(`${functionFullName}: Error retrieving Achievement`);
              console.log(data.message);
            } else {
              const achievement = data.achievement;
              console.log(`${functionFullName}: Success retrieving Achievement`);
              console.log(`${functionFullName}: id: ${achievement.id}`);
              console.log(`${functionFullName}: description: ${achievement.description}`);
              console.log(`${functionFullName}: name: ${achievement.name}`);
              console.log(`${functionFullName}: status: ${achievement.status}`);
              console.log(`${functionFullName}: cost: ${achievement.cost}`);
              console.log(`${functionFullName}: amount to add: ${amount}`);

              let status;
              let transactionDescription = null;
              let adjustedAmount;
              let newAmount;

              if (achievementProgress.goalProgress >= achievement.cost) {
                // Achievement already complete. End function.
                console.log(`${functionFullName}: The achievement is already complete. End the function`);
                return {status: false, message: 'Achievement already complete'};
              } else if ((achievementProgress.goalProgress + amount) === achievement.cost) {
                // This will complete the achievement
                console.log(`${functionFullName}: This will complete the achievement`);
                console.log(`${functionFullName}: achievementProgress.goalProgress + amount: ` +
                 `${(achievementProgress.goalProgress + amount)}`);
                status = 'complete';
              } else if ((achievementProgress.goalProgress + amount) >= achievement.cost) {
                // This will complete the achievement but with a point overflow. Only add enough points
                // to complete the achievement
                console.log(`${functionFullName}: This will complete the achievement with an overflow. ` +
                `Only add enough points to complete the achievement`);
                status = 'complete';
                adjustedAmount =  achievementProgress.goalProgress - achievement.cost;

                transactionDescription = 'overflow: ' + ((achievementProgress.goalProgress + amount) - achievement.cost);
              } else {
                // Achievement not yet complete. Just add the points.
                console.log(`${functionFullName}: Achievement is still in progress. Add the points`);
                status = 'in progress';
              }

              if(adjustedAmount) {
                amount = adjustedAmount;
              }

              console.log(`${functionFullName}: amount to add: ${amount}`);

              newAmount = achievementProgress.goalProgress + amount;
              console.log(`${functionFullName}: amount after addition: ${newAmount}`);

              // Create new transaction
              return newAchievementTransaction(achievementProgress.id, amount, 'Add', transactionDescription)
                .then(result => {
                  if(result.status !== true) {
                    console.log(`${functionFullName}: Something went wrong`);
                  } else {
                    console.log(`${functionFullName}: Achievement Transaction created successfully`);

                    // Add points to achievement progress
                    return sqlUserAchievementProgressModel.update({
                      goalProgress: newAmount,
                      status: status
                    }, {
                      where: {
                        id: achievementProgress.id
                      }
                    })
                      .then(updateResult => {
                        if (!updateResult) {
                          //return res.status(404).json({ status: false, message: 'Update failed.' });
                          console.log(`${functionFullName}: Something went wrong during the Achievement Point Update`);
                          return {
                            status: false,
                            message: 'Something went wrong during the Achievement Point Update.'
                          };
                        } else {
                          console.log(`${functionFullName}: Points added successfully.`);
                          return {
                            status: true,
                            message: 'Points added successfully.'
                          };
                        }
                      })
                      .catch(err => {
                        console.log(`${functionFullName}: Database error`);
                        console.log(err);
                        return {status: false, message: err};
                      });
                  }
                })
                .catch(err => {
                  console.log(`${functionFullName}: Database error`);
                  console.log(err);
                  return {status: false, message: err};
                });

            }
          })
          .catch(err => {
            console.log(`${functionFullName}: Database error`);
            console.log(err);
            return {status: false, message: err};
          });
      }
    })
    .catch( err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    });
};

module.exports.addPointsToAchievementProgress = addPointsToAchievementProgress;

const getAchievementProgressById = function (id) {
  const functionName = 'getAchievementProgressById';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  return sqlUserAchievementProgressModel.findOne({
    attributes: ['id','userId', 'achievementId', 'goalProgress', 'status'],
    where: {
      id: id,
    }
  })
    .then(achievementProgress => {
      if(!achievementProgress) {
        console.log(`${functionFullName}: Unable to find User/Achievement record`);
        return {status: false, message: 'Unable to find User/Achievement record'};
      } else {
        console.log(`${functionFullName}: Retrieved User/Achievement record successfully`);
        // console.log(achievementProgress);
        // console.log(JSON.stringify({status: true, achievementProgress: achievementProgress}));
        return {status: true, achievementProgress: achievementProgress};
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      return {status: false, message: err};
    })
};

const getAchievementById = function (id) {
  const functionName = 'getAchievementById';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  return sqlAchievementModel.findOne({
    attributes: ['id','name', 'description', 'status', 'cost'],
    where: {
      id: id,
    }
  })
    .then(achievement => {
      if(!achievement) {
        console.log(`${functionFullName}: Unable to find Achievement record`);
        return {status: false, message: 'Unable to find Achievement record'};
      } else {
        console.log(`${functionFullName}: Retrieved Achievement record successfully`);
        return {status: true, achievement: achievement};
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    })
};


const newUserAchievementProgress = function (userId, achievementId, startAmount) {
  const functionName = 'newUserAchievementProgress';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  const data = {
    userId: userId,
    achievementId: achievementId,
    startAmount: startAmount
  };

  // Make sure this User/Achievement progress record doesn't already exist
  return sqlUserAchievementProgressModel.findOne({
    attributes: ['id','userId', 'achievementId', 'goalProgress', 'status'],
    where: {
      userId: data.userId,
      achievementId: data.achievementId
    },
  })
    .then(userAchievementProgress => {
      if (userAchievementProgress != null) {
        console.log(`${functionFullName}: This User/Achievement relationship already exists`);
        return {status: false, message: 'This User/Achievement relationship already exists'};
      } else {
        console.log(`${functionFullName}: User/Achievement relationship does not yet exist. Creating`);
        return sqlUserAchievementProgressModel.create({
          userId: data.userId,
          achievementId: data.achievementId,
          goalProgress: data.startAmount
        })
          .then(() => {
          console.log(`${functionFullName}: User/Achievement relationship created: userId: ${data.userId}; ` +
          `achievementId: ${data.achievementId}; goalProgress: ${data.startAmount}`);
          return {status: true, message: 'User/Achievement relationship created' };
        })
          .catch(err => {
            console.log(`${functionFullName}: Error creating User/Achievement relationship`);
            console.log(err);
            return {status: false, message: err };
          });
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    });
};

module.exports.newUserAchievementProgress = newUserAchievementProgress;

const initializeUserAchievementProgress = function (userId) {
  const functionName = 'initializeUserAchievementProgress';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  // Get all achievements
  return sqlAchievementModel.findAll()
    .then(achievements => {
      // Create new User Achievement Progress for each achievement
      for(let i = 0; i < achievements.length; i++) {
        console.log(`${functionFullName}: Initializing achievement '${achievements[i].name}' for userId ${userId}`);

        const data = {
          userId: userId,
          achievementId: achievements[i].id,
          startAmount: achievements[i].startAmount
        };

        newUserAchievementProgress(data.userId, data.achievementId, data.startAmount);
      }

      console.log(`${functionFullName}: User Achievements initialized`);
      return { status: true, message : 'User Achievements initialized' };

    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return { status: false, message: err };
    });
};

module.exports.initializeUserAchievementProgress = initializeUserAchievementProgress;

const resetUserAchievementProgress = function (userId) {
  const functionName = 'resetUserAchievementProgress';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  // Remove the user's achievement progress
  return removeUserAchievements(userId)
    .then(removeResult => {
      if (!removeResult) {
        console.log(`${functionFullName}: Something went very wrong`);
        return {status: false, message: 'Something went very wrong'};
      } else {
        if (removeResult.status !== true) {
          console.log(`${functionFullName}: Error removing user achievements`);
          console.log(removeResult);
          return {status: false, message: 'Error removing user achievements'};
        } else {
          console.log(`${functionFullName}: User achievements removed successfully`);
          console.log(removeResult);

          // Initialize user's achievements
          return initializeUserAchievementProgress(userId)
            .then(initializeResult => {
              if (!initializeResult) {
                console.log(`${functionFullName}: Something went very wrong`);
                return {status: false, message: 'Something went very wrong'};
              } else {
                if (initializeResult.status !== true) {
                  console.log(`${functionFullName}: Error initializing user achievements`);
                  console.log(initializeResult);
                  return {status: false, message: 'Error initializing user achievements'};
                } else {
                  console.log(`${functionFullName}: User achievements initialized successfully`);
                  console.log(initializeResult);
                  return {status: true, message: 'User achievements initialized successfully'};
                }
              }
            })
            .catch(err => {
              console.log(`${functionFullName}: Database error`);
              console.log(err);
              return {status: false, message: err};
            });
        }
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    });
};

module.exports.resetUserAchievementProgress = resetUserAchievementProgress;



const resetAllUsersAchievements = function () {
  const functionName = 'resetAllUsersAchievements';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  return sqlUserModel.findAll()
    .then(usersResult => {
      if (!usersResult) {
        console.log(`${functionFullName}: Did not find any user records`);
        return {status: false, message: 'Did not find any user records'};
      } else {
        console.log(`${functionFullName}: User records retrieved successfully`);
        for (let i = 0; i < usersResult.length; i++) {
          console.log(`${functionFullName}: Resetting achievements for user ${usersResult[i].username}`);
          resetUserAchievementProgress(usersResult[i].id)
            .then(resetResult => {
              if (!resetResult) {
                console.log(`${functionFullName}: Something went very wrong`);
              } else {
                if (resetResult.status !== true) {
                  console.log(`${functionFullName}: Error resetting achievements for ${usersResult[i].username}`);
                } else {
                  console.log(`${functionFullName}: Successfully reset achievements for ${usersResult[i].username}`);
                }
              }
            })
            .catch(err => {
              console.log(`${functionFullName}: Database error`);
              console.log(err);
            });
        }

        console.log(`${functionFullName}: Finished resetting all user achievements`);
        return {status: true, message: 'Finished resetting all user achievements'};
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    })
};

module.exports.resetAllUsersAchievements = resetAllUsersAchievements;

const removeUserAchievements = function (userId) {
  const functionName = 'removeUserAchievements';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  // Remove the user's achievement progress
  return sqlUserAchievementProgressModel.destroy({
    where: {
      userId: userId
    }
  })
    .then(result => {
      if (!result) {
        console.log(`${functionFullName}: Error deleting user achievements`);
        return {status: false, message: 'Error deleting user achievements.'};
      } else {
        console.log(`${functionFullName}: User achievements deleted successfully`);
        console.log(result);
        return {status: true, message: 'User achievements deleted successfully'}
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    });
};

module.exports.removeUserAchievements = removeUserAchievements;

/*
const removeUserAchievementTransactions = function (userId) {
  const functionName = 'removeUserAchievementTransactions';
  const functionFullName = `${componentName} ${functionName}`;
  console.log(`Start ${functionFullName}`);

  // Remove the user's achievement progress
  return sqlAchievementTransactionModel.destroy({
    where: {
      userId: userId
    }
  })
    .then(result => {
      if (!result) {
        console.log(`${functionFullName}: Error deleting user achievements`);
        return {status: false, message: 'Error deleting user achievements.'};
      } else {
        console.log(`${functionFullName}: User achievements deleted successfully`);
        console.log(result);
        return {status: true, message: 'User achievements deleted successfully'}
      }
    })
    .catch(err => {
      console.log(`${functionFullName}: Database error`);
      console.log(err);
      return {status: false, message: err};
    });

};

module.exports.removeUserAchievementTransactions = removeUserAchievementTransactions;
*/
