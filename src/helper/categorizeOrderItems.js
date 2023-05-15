
/**
 * @param  {} items
 * @returns {Object} categories
 * @description
 * This function takes an array of items and returns an object with the items in each category.
 * 
 */
const categorizeByCategoryName = (items) => {
    const categories = {};
    for (const item of items) {
        const categoryName = item.name;
        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }
        categories[categoryName].push(item.items);
    }
    return Object.entries(categories);
}

export { categorizeByCategoryName }