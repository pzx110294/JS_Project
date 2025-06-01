module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        ISBN: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PublicationDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
         CoverUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
    }, {
        timestamps: true
    });

    return Book;
};
