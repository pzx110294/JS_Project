function validateDate(PublicationDate) {
    if (PublicationDate === undefined || PublicationDate === null || PublicationDate === '') {
        return null;
    }
    const date = new Date(PublicationDate);
    if (date.toString() === 'Invalid Date') {
        const error = new Error('Invalid PublicationDate format');
        error.status = 400;
        throw error;
    }
    return PublicationDate;
}
module.exports = { validateDate }