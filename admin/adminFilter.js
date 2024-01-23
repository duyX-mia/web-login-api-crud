const manufacturerFilter = document.getElementById('filter-by-manufacturer');
const categoryFilter = document.getElementById('filter-by-category');

document.addEventListener('DOMContentLoaded', () => {
    // MANUFACTURER
    const labelsManufactor = manufactorData.map(el => el.label);

    labelsManufactor.map(elByLabel => {
        manufacturerFilter.innerHTML += `
            <li onclick="filterByManufactor('${elByLabel}')">${elByLabel}</li>
        `
    })

    // CATEGORY
    const labelsCategory = categoryData.map(el => el.label);

    labelsCategory.map(elByLabel => {
        categoryFilter.innerHTML += `
        <li onclick="filterByCategory('${elByLabel}')">${elByLabel}</li>
    `;
    });
})

function filterByManufactor(label) {
    const filtered = tableItem.filter(item => {
        return item.manufacturerName === label;
    });
    renderDomElement(filtered)
}

function filterByCategory(label) {
    const filtered = tableItem.filter(item => {
        return item.categoryName === label;
    });
    renderDomElement(filtered)
    console.log(filtered);
}