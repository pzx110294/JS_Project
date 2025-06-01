const db = require('../../models');

async function getUserLibrary(userId, status) {
  const validStatuses = ['to read', 'reading', 'finished'];
  if (status && !validStatuses.includes(status)) {
    const error = new Error(`Invalid status: ${status}`);
    error.status = 400;
    throw error;
  }
  const where = status ? { status } : {};
  return await db.User.findByPk(userId, {
    include: [{
      model: db.Book,
      as: 'Library',
      through: {
        model: db.UserBook,
        where: where,
        attributes: ['status']
      },
      attributes: ['id', 'Title', 'ISBN', 'PublicationDate'],
      include: [
        {
          model: db.Author,
          attributes: ['id', 'Name'],
          through: {
            attributes: []
        }
        },
        {
          model: db.Genre,
          attributes: ['id', 'Name'],
          through: {
            attributes: []
          }
}
      ]
    }],
    attributes: ['username']
  });
}

module.exports = { getUserLibrary };