module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Genre;
};
