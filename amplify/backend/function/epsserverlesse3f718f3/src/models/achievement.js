/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('achievement', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'id',
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'name'
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'description'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		},
		status: {
			type: DataTypes.STRING(45),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		},
		cost: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '100',
			field: 'cost'
		},
    incrementAmount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'increment_amount'
    },
    startAmount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      field: 'start_amount'
    },
    achievementFamily: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'achievement_family'
    },
    level: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      defaultValue: '1',
      field: 'level'
    },
	}, {
		tableName: 'achievement'
	});
};
