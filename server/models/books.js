module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        ISBN: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PublicationDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return Book;
};
