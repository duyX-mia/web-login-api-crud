const table = document.getElementById('table-id');
let tableItem = [];

const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const infoInput = document.getElementById('info');
const detailInput = document.getElementById('detail');
const ratingStarInput = document.getElementById('ratingStar');
const imageInput = document.getElementById('image');
const manufactorInput = document.getElementById('manufactor');
const categoryInput = document.getElementById('category');

const saveBtn = document.getElementById('sav-btn');
const resetBtn = document.getElementById('res-btn');
const closeBtn = document.getElementById('close-btn');
const loadBtn = document.getElementById('load-btn');

const modalAddNewEl = document.getElementById("modal-add-new");
const modalAddNew = new bootstrap.Modal(modalAddNewEl);
const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");

// AUTHORIZATION API
let headers = new Headers();
let username = 'Username1';
let password = '123456';

function authorization() {
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json')
}

// FIRST LOAD PAGE
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

async function fetchData() {
    try {
        const data = await getData();
        if (Array.isArray(data.content)) {
            tableItem = data.content
            renderDomElement(tableItem);
        } else {
            console.log("Not an Array");
        }
    } catch (error) {
        console.log("error");
    }
}

// GET ALL DATA FROM API
async function getData() {
    authorization();
    const response = await fetch("http://localhost:8080/api/v1/products", { headers });
    const data = await response.json();
    return data
}

// -----------------WORKING WITH IMAGE,Image Handling-----------------
let imgUploadName = ""

imageInput.addEventListener('change', (e) => {
    let url;
    let item = {};

    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        url = URL.createObjectURL(file)
        imgUploadName = file.name
    };
    item = { ...item, imageName: url };
    const previewImage = document.getElementById('preview-image');
    previewImage.src = url;
})

// -----------------OPTION VALUE-----------------
const manufactorData = [
    { value: 1, label: "SAMSUNG" },
    { value: 2, label: "APPLE" },
    { value: 3, label: "XIAOMI" },
    { value: 4, label: "OPPO" }
];

const categoryData = [
    { value: 1, label: "Điện thoại" },
    { value: 2, label: "Tablet" },
    { value: 3, label: "Laptop" }
];

function createOptions(selectedId, dataArray) {
    const selectedElement = document.getElementById(selectedId);

    dataArray.forEach(data => {
        const optionElement = document.createElement("option");
        optionElement.value = data.value;
        optionElement.textContent = data.label;
        selectedElement.appendChild(optionElement);
    });
}

createOptions("manufactor", manufactorData);
createOptions("category", categoryData);

// ------------------------RENDER ELEMENT------------------------
function renderDomElement(tableItem) {
    table.innerHTML = "";
    tableItem.map((item, index) => {
        const tRow = document.createElement('tr');
        tRow.id = item.id;

        const imgUrl = `${window.location.origin}/imgs/${item.imageName}`

        tRow.innerHTML = `
                <th>${index + 1}</th>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.info}</td>
                <td>${item.detail}</td>
                <td>${item.ratingStar}</td>
                <td><img style="width: 100px; height: 100px" src="${imgUrl}"></td>
                <td>${item.manufacturerName}</td>
                <td>${item.categoryName}</td>
                <td><button class="edit-btn" onClick="editElement(${item.id})">Edit</button></td>
                <td><button class="del-btn" onClick="deleteData(${item.id})">Delete</button></td>
            `;
        table.appendChild(tRow)
    })
}

// ---------------ADD DATA ELEMENT EVENT---------------
saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await addElement();
    modalAddNew.hide()
});

async function addElement() {
    const item = {
        name: nameInput.value,
        price: priceInput.value,
        info: infoInput.value,
        detail: detailInput.value,
        ratingStar: ratingStarInput.value,
        imageName: imgUploadName,
        manufacturerId: manufactorInput.value,
        categoryId: categoryInput.value
    };

    try {
        authorization();
        const response = await fetch("http://localhost:8080/api/v1/products", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(item)
        })
        const responseData = await response.json();
        const newTableItem = [...tableItem, responseData];
        renderDomElement(newTableItem);
        clearInput()

    } catch (error) {
        console.log("Error", error.message);
    }
}

// ---------------EDIT ELEMENT---------------
function editElement(dataId) {
    modalAddNew.show()
    const selected = tableItem.find(item => item.id === dataId)

    if (selected) {
        nameInput.value = selected.name;
        priceInput.value = selected.price;
        infoInput.value = selected.info;
        detailInput.value = selected.detail;
        ratingStarInput.value = selected.ratingStar;
        imageInput.value = imgUploadName;
        manufactorInput.value = selected.manufacturerId;
        categoryInput.value = selected.categoryId
    }

    let editItemId = dataId;

    saveBtn.addEventListener('click', () => {

        if (editItemId === dataId) {
            const updatedItem = {
                id: dataId,
                name: nameInput.value,
                price: priceInput.value,
                info: infoInput.value,
                detail: detailInput.value,
                ratingStar: ratingStarInput.value,
                imageName: imgUploadName,
                manufacturerId: manufactorInput.value,
                categoryId: categoryInput.value
            }

            authorization();
            fetch(`http://localhost:8080/api/v1/products/${dataId}`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(updatedItem)
            }).then((res) => {
                if (res.ok) {
                    console.log("Item updated successfully");
                    const updatedTableItem = tableItem.map(item => {
                        if (item.id === editItemId) {
                            return updatedItem;
                        }
                        return item;
                    })
                    renderDomElement(updatedTableItem);
                    clearInput();
                    editItemId = null;
                } else {
                    console.log("Error updating item");
                };
            }).catch(error => {
                console.log("Error", error);
            });
        }
    });
}

// ---------------------DELETE ELEMENT DATA---------------------
function deleteData(dataId) {
    authorization();
    fetch(`http://localhost:8080/api/v1/products/${dataId}`, {
        method: "DELETE",
        headers: headers,
    }).then(async () => {
        const data = await getData();
        tableItem = data.content
        renderDomElement(data.content);
    }).catch(error => {
        console.log("Error", error);
    });
}

// ------------------RESET BTN EVENT------------------
resetBtn.addEventListener('click', () => {
    clearInput()
})

// CLEAR INPUT
function clearInput() {
    nameInput.value = "";
    priceInput.value = "";
    infoInput.value = "";
    detailInput.value = "";
    imageInput.value = "";
    manufactorInput.value = "";
    categoryInput.value = ""
}