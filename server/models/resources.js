const sequelize = require('../db/dbConfig');
const {DataTypes} = require('sequelize');
const Resource = sequelize.define(
    'Resource',
    {
        Name: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        timestamps: true,
    },
);
module.exports = Resource;