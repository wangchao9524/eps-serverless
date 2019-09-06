module.exports = function (sequelize, DataTypes) {
    return sequelize.define('notification', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'id',
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'title'
        },
        audience: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'audience'
        },
        event: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'event'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'createdAt'
        },
        description: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'description'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'updatedAt'
        },
        timeSeen: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'timeSeen'
        },
    }, {
            tableName: 'notification'
        });
};
