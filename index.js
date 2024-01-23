const cardList = document.getElementById('product-list')
let listArray = [];

// AUTHORIZATION API
let headers = new Headers();
let username = 'Username1';
let password = '123456';

function authorization() {
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json')
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
});

async function fetchData() {
    try {
        const data = await getData()
        if (Array.isArray(data.content)) {
            listArray = data.content;
            renderDomElement(listArray);
        } else {
            console.log('Not an Array');
        }
    } catch (error) {
        console.log("error:", error);
    }
}

async function getData() {
    authorization()
    const res = await fetch('http://localhost:8080/api/v1/products', { headers })
    const data = await res.json();
    return data
}

function renderDomElement(data) {
    data.map(product => {
        const imgUrl = `${window.location.origin}/imgs/${product.imageName}`

        const card = document.createElement('div');
        card.className = 'col-3 product-card';
        card.id = product.id;
        card.innerHTML = `
            <div class="product-img">
                <img src="${imgUrl}">
            </div>
            <div class="text">
                <h3 class="card-name">${product.name}</h3>
                <p class="manufactor">Hãng sản xuất ${product.manufacturerName}</p>
                <div class="rate">
                    ${product.ratingStar}
                    <div class="price">
                        ${product.price}
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>
                </div>
            </div>
        `
        cardList.appendChild(card)
    })
}