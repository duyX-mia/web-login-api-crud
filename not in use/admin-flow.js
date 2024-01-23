// selector
const nameEl = document.getElementById("name");
const priceEl = document.getElementById("price");
const infoEl = document.getElementById("info");
const imageEl = document.getElementById("image");
const detailsEl = document.getElementById("detail");
const starEl = document.getElementById("star");
const manufactureEL = document.getElementById("manufacture");
const categoryEL = document.getElementById("category");
const tableBodyEl = document.getElementById("table-body");
const btnSaveEl = document.getElementById("btn-save");
const btnAddNewEL = document.getElementById("btn-add-new");
const modalAddNewEl = document.getElementById("modal-add-new");
const modalAddNew = new bootstrap.Modal(modalAddNewEl);
const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");
// const modalLoadUser = document.querySelector("#modal-load-user");
// event

//getlist -fetchdata with basic authentication header
async function getProductList() {
  let headers = new Headers();
  
  let username = 'Username1';
  let password = '123456';

  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  headers.set('Accept', 'application/json');
  
  const res = await fetch("http://localhost:8080/api/v1/products", {headers});
  const data = await res.json(); 
  console.log('data', data); 
  return data;
}
//Event Listeners- DOMContentLoaded-renderDomProduct
document.addEventListener("DOMContentLoaded", () => {
  getProductList().then((data) => {
    console.log('data', data);
    renderDomProduct(data.content);
  });
});

//Event Listener for Save Button (btnSaveEl)
let product = {};
btnSaveEl.addEventListener("click", (e) => {
  const productEditing = getLocalStorage("productEditing");
  if (productEditing) {
    editProductItem();
  } else {
    addProductItem(e);
  }
});
//Image Change Event Listener (imageEl):
imageEl.addEventListener("change", (e) => {
  let url;

  if (e.target.files.length > 0) {
    const file = e.target.files[0];
    url = URL.createObjectURL(file);
  }
  product = { ...product, image: url };
});
//Saves data to the local storage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
// Retrieves data from local storage
function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
//Generates a random ID
function generateRandomId() {
  return Math.random();
}
//Clears input value-resetValues
function resetValues() {
  nameEl.value = "";
  priceEl.value = "";
  infoEl.value = "";
  imageEl.value = "";
  detailsEl.value = "";
  starEl.value = "";
  // manufactureEL.value = "";
  // categoryEL.value = "";
  product = {};
}
//edit
function editProductItem() {
  let products = getLocalStorage("products");
  const productEditing = getLocalStorage("productEditing");
  const productEditEl = document.getElementById(productEditing.id);
  const index = products.findIndex(
    (product) => product.id === productEditing.id
  );
  productEditEl.innerHTML = `
    <td>${products.length}</td>
    <td>${nameEl.value}</td>
    <td>${priceEl.value}</td>
    <td>${infoEl.value}</td>
    <td>${detailsEl.value}</td>
    <td>${starEl.value}</td>
    <td><img style="width: 100px; height: 100px" src="${imageEl.value}"}</td>
    <td>${manufactureEL.options[manufactureEL.selectedIndex].text}</td>
    <td>${categoryEL.options[categoryEL.selectedIndex].text}</td>
    <td><button class="btn btn-warning" onclick="editProduct(${productEditing.id
    })">Edit</button></td>
    <td><button onclick="deleteProduct(${productEditing.id
    })" class="btn btn-danger">Delete</button></td>
  `;
  products[index] = {
    id: productEditing.id,
    name: nameEl.value,
    price: priceEl.value,
    info: infoEl.value,
    details: detailsEl.value,
    star: starEl.value,
    image: imageEl.value,
    manufacture: manufactureEL.value,
    category: categoryEL.value,
  };
  saveToLocalStorage("products", products);

  saveToLocalStorage("productEditing", "");
  resetValues();
  modalAddNew.hide();
}
//create-Posts data to a specified URL
async function postData(url = "", data = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
  return res.json();
}
//Adds a new product to the list, sends a POST request to the server.
function addProductItem(e) {
  e.preventDefault();
  e.stopPropagation();
  let products = getLocalStorage("products") || [];
  product = {
    ...product,
    id: generateRandomId(),
    name: nameEl.value,
    price: priceEl.value,
    info: infoEl.value,
    details: detailsEl.value,
    star: starEl.value,
    manufacture: manufactureEL.value,
    category: categoryEL.value,
  };
  products.push(product);
  let headers = new Headers();

  let username = 'Username1';
  let password = '123456';

  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  
  const dataToSend = {
    name: product.name,
    price: product.price,
    info: product.info,
    detail: product.details,
    star: product.star,
    imageName: "NEW.jpg",
    manufactureId: "4",
    categoryId: "1"
  };

  console.log('Data to be sent:', JSON.stringify(dataToSend));


  fetch('http://localhost:8080/api/v1/products', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      name: product.name,
      price: product.price,
      info: product.info,
      detail: product.details,
      star: product.star,
      imageName: "NEW.jpg",
      manufactureId: "4",
      categoryId: "1"
    }),
  }).then(data =>{
    return data.json()
  }).then(data =>{
    console.log('Server response:',data);
  })
  // fetch("http://localhost:3000/products", {
  //   method: "get",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   // body: JSON.stringify(product),
  // }).then(data => {
  //   console.log(data);
  const trNode = document.createElement("tr");
  trNode.setAttribute("id", product.id);
  trNode.innerHTML = `
      <td>${products.length}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.info}</td>
      <td>${product.details}</td>
      <td>${product.star}</td>
      <td><img style="width: 100px; height: 100px" src="${product.image}"}</td>
      <td>${manufactureEL.options[manufactureEL.selectedIndex].text}</td>
      <td>${categoryEL.options[categoryEL.selectedIndex].text}</td>
      <td><button class="btn btn-warning" onclick="editProduct(${product.id
    })">Edit</button></td>
      <td><button onclick="deleteProduct(${product.id
    })" class="btn btn-danger">Delete</button></td>
    `;
  tableBodyEl.appendChild(trNode);
  resetValues();
  modalAddNew.hide();
  // })
  // $.ajax({
  //   url: " http://localhost:3000/products",
  //   type: 'POST',
  //   datatype: JSON,
  //   data: JSON.stringify(product),
  //   contentType: 'application/json',
  //   success: function (result) {
  //     console.log('====================================');
  //     console.log('result', result);
  //     console.log('====================================');
  //     $('body').append(result.id);
  //   }
  // });

  saveToLocalStorage("products", products);

}
//delete
function deleteProduct(productId) {
  let headers = new Headers();

  let username = 'Username1';
  let password = '123456';

  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  
  fetch(`http://localhost:8080/api/v1/products/${productId}`, {
    headers,
    method: 'DELETE'
  }).then(data => {
    console.log('data', data);
    const deletedItem = document.getElementById(productId);
    const products = getLocalStorage("products");
    const removedProduct = products.filter((product) => product.id !== productId);
    saveToLocalStorage("products", removedProduct);
    deletedItem.remove();
  });
}
// Prepares the modal for editing a product
function editProduct(productId) {
  modalAddNew.show();
  const products = getLocalStorage("products");
  const product = products.find((product) => product.id === productId);
  saveToLocalStorage("productEditing", product);
  modalTitle.innerHTML = "Edit product";
  nameEl.value = product.name;
  priceEl.value = product.price;
  infoEl.value = product.info;
  detailsEl.value = product.details;
  starEl.value = product.star;
  imageEl.value = "";
  manufactureEL.value = product.manufacture;
  categoryEL.value = product.category;
}
//render element
function renderDomProduct(products) {
  products.map((product, index) => {
    return (tableBodyEl.innerHTML += `
        <tr id="${product.id}">
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.info}</td>
            <td>${product.details}</td>
            <td>${product.star}</td>
            <td><img style="width: 100px; height: 100px" src="${product.image
      }"}</td>
            <td>${manufactureEL.options[manufactureEL.selectedIndex].text}</td>
            <td>${categoryEL.options[categoryEL.selectedIndex].text}</td>
            <td><button class="btn btn-warning btn-edit" onclick="editProduct(${product.id
      })">Edit</button></td>
            <td><button onclick="deleteProduct(${product.id
      })" class="btn btn-danger">Delete</button></td>
        </tr>
        `);
  });
}
