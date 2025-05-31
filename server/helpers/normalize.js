function normalizeIds(ids, label) {
    if (typeof ids === 'string') {
        try {
            ids = JSON.parse(ids);
        } catch {
            throw new Error(`Wrong ${label} format`);
        }
    }
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    return ids;
}
module.exports = { normalizeIds }