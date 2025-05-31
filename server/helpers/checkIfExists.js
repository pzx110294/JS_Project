const {getAuthorById} = require("../services/authors/get");
const {getGenreById} = require("../services/genres/get");

async function checkIfAuthorExists(authorIds) {
    for (const id of authorIds) {
        const author = await getAuthorById(id);
        if (!author) {
            const error = new Error(`Author with id ${id} does not exist`);
            error.status = 404;
            throw error;
        }
    }
}

async function checkIfGenreExists(genreIds) {
    for (const id of genreIds) {
        const genre = await getGenreById(id);
        if (!genre) {
            const error = new Error(`Genre with id ${id} does not exist`);
            error.status = 404;
            throw error;
        }
    }
}

module.exports = { checkIfAuthorExists, checkIfGenreExists }