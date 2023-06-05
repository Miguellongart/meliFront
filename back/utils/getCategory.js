const getCategory = (data) => {
    const filters = data.filters !== undefined;
    const categoryFilter = filters  ? data.filters.find(filter => filter.id === 'category') : undefined;
    const categoryValue = categoryFilter ? categoryFilter.values[0] : undefined;
    const categoryNames = categoryValue ? categoryValue.path_from_root.map(category => category.name) : [];

    return categoryNames;
}

module.exports = getCategory;