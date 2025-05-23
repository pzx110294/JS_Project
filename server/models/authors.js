module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define('Author', {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Author;
};
