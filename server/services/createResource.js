const Resource = require('../models/resources');
async function createResource(resource) {
    const data = await Resource.create(resource);
    return [data];
}


module.exports = {createResource};
