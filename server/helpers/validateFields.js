function validateFields(obj, fields, modelName = 'object') {
    if (isEmpty(obj)) {
        const error = new Error(`${modelName} not found`);
        error.status = 404;
        throw error;
    }
    for (let field of fields) {
        
        if (isEmpty(obj[field])) {
            const error = new Error(`Empty ${field} field`);
            error.status = 400;
            throw error;
        }
    }
}
function isEmpty(value) {
    return value === undefined || value === null || value === '';
}
module.exports = { validateFields };