const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');

async function updateGenreById(id, genre) {
    validateFields(genre, ['Name'], 'Genre');
    
    const [updatedRows ] = await db.Genre.update(genre, {
        where: {id: id}
    })
    if (updatedRows ===  0 ) {
        const error = new Error(`Genre with id ${id} not found`);
        error.status = 404;
        throw error;
    }
    const updatedGenre = await db.Genre.findByPk(id, {include: db.Book});
    return updatedGenre;
}
module.exports = { updateGenreById }