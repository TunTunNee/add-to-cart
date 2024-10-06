let productCartHTML = document.querySelector(".product-cart");
let productCartArray = [];
let card = "";
let productCart = [];
let listProductCart = document.querySelector(".cart");
let cartApi = "./data.json";
fetch(cartApi)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    productCartArray = data;
    showProductData();

    // get data cart from memory
    if (localStorage.getItem("cart")) {
      productCart = JSON.parse(localStorage.getItem("cart"));
      showCartToHTML();
    }
  });
function showProductData() {
  productCartHTML.innerHTML = "";
  if (productCartArray.length > 0) {
    productCartArray.map((i) => {
      let card = document.createElement("div");
      card.classList.add("item");
      card.dataset.id = i.id;
      card.innerHTML = `<div class="products" id="${i.id}">
        <img src="${i.image.desktop}" alt=""/ id="productImgs">
        <div class="inc_dec_btns">
          <button class="addToCart">Add to Cart</button>
          <button class="sum">
            <img src="assets/images/icon-increment-quantity.svg"/ id="add">  
            <p class="calc">0</p> 
            <img src="assets/images/icon-decrement-quantity.svg"/ id="subtract">       
          </button>
        </div>
        <p id="category">${i.category}</p>
        <p id="name"><b>${i.name}</b></p>
        <p id="price"><b>$${i.price.toFixed(2)}</b></p>
      </div>`;
      productCartHTML.appendChild(card);
    });
  } else {
    productCartHTML.innerHTML = `<p>No product found</p>`;
  }
}
productCartHTML.addEventListener("click", (event) => {
  // console.log(event);
  let cartPosition = event.target;
  if (cartPosition.classList.contains("addToCart")) {
    let productId = cartPosition.closest(".item").dataset.id;
    let newProductId = parseInt(productId);
    addToCart(newProductId);
  }
});
function addToCart(productId) {
  let productCartPosition = productCart.findIndex(
    (value) => value.product == productId
  );

  if (productCart.length <= 0) {
    productCart = [
      {
        product: productId,
        quantity: 1,
      },
    ];
  } else if (productCartPosition < 0) {
    productCart.push({
      product: productId,
      quantity: 1,
    });
  } else {
    productCart[productCartPosition].quantity =
      productCart[productCartPosition].quantity + 1;
  }
  showCartToHTML();
  addCartToLocalStorage();
}
let cartCard = "";
function showCartToHTML() {
  listProductCart.innerHTML = "";
  let totalQuantity = 0;
  let totalProduct = 0;
  if (productCart.length > 0) {
    productCart.forEach((cartt) => {
      totalQuantity = totalQuantity + cartt.quantity;

      let cartCard = document.createElement("div");
      cartCard.classList.add("item");
      cartCard.dataset.id = cartt.product;

      let newCartProduct = parseInt(cartt.product);
      let productPosition = productCartArray.findIndex(
        (value) => value.id == newCartProduct
      );
      let productInformation = productCartArray[productPosition];
      totalProduct += productInformation.price * cartt.quantity;
      listProductCart.appendChild(cartCard);
      cartCard.innerHTML = `
      <img src="${
        productInformation.image.desktop
      }" alt="" id="productImgs" width="50px"/>
      <br/>
      <button class="minus"> < </button>
     <p>${cartt.quantity}</p>
     <button class="plus"> > </button>
      <p id="category">${productInformation.category}</p>
      <p id="price"><b>$${productInformation.price.toFixed(2)}</b></p>
      <hr>
  
      `;
    });
  }
  document.querySelector("#Total").innerText = totalProduct;
  // console.log(totalQuantity);
}
// local storage: creates a temp memory to save cart items
function addCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(productCart));
}

listProductCart.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product = positionClick.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }

    console.log(product, type);

    changeCartQuantity(product, type);
  }
});

function changeCartQuantity(product, type) {
  let productCartPosition = productCart.findIndex(
    (value) => value.product == product
  );

  let info = productCart[productCartPosition];
  switch (type) {
    case "plus":
      productCart[productCartPosition].quantity =
        productCart[productCartPosition].quantity + 1;
      break;

    default:
      let changeQuantity = productCart[productCartPosition].quantity - 1;
      if (changeQuantity > 0) {
        productCart[productCartPosition].quantity = changeQuantity;
      } else {
        productCart.splice(productCartPosition, 1);
      }
      break;
  }
  showCartToHTML();
  addCartToLocalStorage();
}

//{
/* <h1>${productInformation.price * cartt.quantity }</h1> */
//}

// document.querySelector(".products").addEventListener("click",()=>{
//   alert("welcome")
// })
// document.querySelectorAll('.products').forEach(product => {
//   product.addEventListener('click', function() {
//     let productId = this.getAttribute('id');
//     console.log(productId);
//     alert(productId)

//   });
// })
