import { products } from "./src/stock.js";

/* ------------------------------VARIABLES---------------------------------- */

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
let myCart = [];
let myCartDom = [];
let cartQuantity = 0;
let total = 0;

getAndFillCartFromSessionStorage();
/* ------------------------------PRODUCTS DISPLAY FROM STOCK---------------------------------- */

products.forEach((product) => {
    let productContent = document.createElement("article");
    productContent.classList.add("product");
    productContent.innerHTML = `<div class="img-container">
                                <img src="${product.img}"
                                    alt="product car decal" class="product-img">
                                <button class="bag-btn" id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i>
                                    click the image to add to the cart
                                </button>
                                </div>
                                <h3>${product.title}</h3>
                                <h4>$${product.price}</h4>`
    productsDOM.append(productContent);
    /* ----------CLICK PRODUCT TO ADD AND SUM IN THE BASQUET---------------------------- */

    productContent.addEventListener("click", () => {
        let productAlreadyExists = addItemToCart(product);
        if (productAlreadyExists) return;
        myCart.push(products[product.id - 1]);
        setMyCartToSessionStorage();
        createCartElement(product);
    })
});

function createCartElement(product) {
    let cartItems = document.createElement("div");
    cartItems.setAttribute('id', `${product.id}_cart_item`);
    myCartDom.push(cartItems);
    cartItems.classList.add("cart-item");
    cartItems.innerHTML = `<img src="${product.img}" alt="product car decal">
                                <div>
                                    <h4>${product.title}</h4>
                                    <h5>${product.price}</h5>
                                    <span class="remove-item">Delete</span>
                                </div>
                                <div>
                                    <i class="fas fa-chevron-up" id="${product.id}_cart_up"></i>
                                    <p class="item-amount" id="${product.id}_cart_product">${product.quantity}</p>
                                    <i class="fas fa-chevron-down" id="${product.id}_cart_down"></i>
                                </div>`
    setTimeout(function () {
        addEventListenerToCartArrows(`${product.id}_cart_up`, "up", product);
        addEventListenerToCartArrows(`${product.id}_cart_down`, "down", product);
    }, 1);
    cartContent.append(cartItems);
}

function addEventListenerToCartArrows(id, operation, product) {
    document.getElementById(id).addEventListener("click", () => {
        addItemToCart(product, operation);
    });
}

function addCartIcon(operation) {
    operation == 'down' ? cartQuantity-- : cartQuantity++;
    cartItems.innerText = cartQuantity;
}

function addItemToCart(product, operation) {
    let productAlreadyExists;
    addCartIcon(operation);
    myCart.find(function (cartObj, index) {
        if (cartObj.id == product.id) {
            operation == 'down' ? cartObj.quantity-- : cartObj.quantity++;
            productAlreadyExists = true;
            document.getElementById(`${product.id}_cart_product`).innerText = cartObj.quantity;
            cartObj.quantity == 0 && removeItemFromCart(cartObj, index);
        }
    })
    setMyCartToSessionStorage();
    return productAlreadyExists;
}


function removeItemFromCart(cartObj, index) {
    document.getElementById(`${cartObj.id}_cart_item`).remove();
    myCart.splice(index, 1);
}


/* --------------------------------FUNCTIONS FOR OPEN AND CLOSE THE CART----------------------- */

const changeCartStyles = () => {
    cartDOM.classList.toggle("showCart");
    cartOverlay.classList.toggle("transparentBcg");
}
const toggleCartOpenClose = () => {
    cartBtn.addEventListener("click", changeCartStyles);
    closeCartBtn.addEventListener("click", changeCartStyles);
}
toggleCartOpenClose();
/* -------------------------------- DELETE BUTTON IN THE CART----------------------- */
clearCartBtn.addEventListener("click", function () {
    cartQuantity = 0;
    cartItems.innerText = 0;
    for (let i = 0; i < myCartDom.length; i++) {
        document.getElementById(`${myCart[i].id}_cart_product`).innerText = 0;
        myCart[i].quantity = 1;
        myCartDom[i].remove();
    }
    myCart = [];
    myCartDom = [];
    total = 0;
    setMyCartToSessionStorage();
});

/* --------------------------------SESSION STORAGE----------------------- */

function setMyCartToSessionStorage() {
    localStorage.setItem("myCart", JSON.stringify(myCart));
    localStorage.setItem("cartQuantity", JSON.stringify({ cartValue: cartQuantity }));
}

function getAndFillCartFromSessionStorage() {
    let storageCart = window.localStorage.getItem("myCart");
    let temp = window.localStorage.getItem("cartQuantity");
    if (JSON.parse(temp) && JSON.parse(temp).cartValue) {
        cartItems.innerText = JSON.parse(temp).cartValue;
        cartQuantity = JSON.parse(temp).cartValue;
    }
    if (JSON.parse(storageCart)) {
        myCart = JSON.parse(storageCart);
        for (let i = 0; i < myCart.length; i++) {
        createCartElement(myCart[i]);
        }
    }
}

