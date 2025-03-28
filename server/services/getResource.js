const Resource = require('../models/resources');
async function getResource() {
    const data = await Resource.findAll();
    return data;
}
async function getResourceById(id) {
    const data = await Resource.findByPk(id);
    return data;
}
module.exports = {getResource, getResourceById};