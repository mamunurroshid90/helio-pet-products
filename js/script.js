document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const counter = document.querySelector(".counter");
  const decreaseBtn = document.querySelector(".decrese");
  const increaseBtn = document.querySelector(".increase");
  const addToCartBtn = document.querySelector(".add-to-cart-btn button");
  const cartDrawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const closeDrawerBtn = document.querySelector(".close-drawer");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  // Product details
  const MAX_QUANTITY = 10;
  let count = 1;
  const productPrice = 249.0;
  const productName = "Helio Pet Device";
  const productImage = "/images/product-1.png";

  // Initialize cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Load cart when page loads
  if (cart.length > 0) {
    updateCart();
  }

  // Counter buttons with max limit
  decreaseBtn.addEventListener("click", function () {
    if (count > 1) {
      count--;
      counter.textContent = count;
    }
  });

  increaseBtn.addEventListener("click", function () {
    if (count < MAX_QUANTITY) {
      count++;
      counter.textContent = count;
    } else {
      alert(`Maximum quantity per product is ${MAX_QUANTITY}`);
    }
  });

  // Add to cart with quantity validation
  addToCartBtn.addEventListener("click", function () {
    const existingItemIndex = cart.findIndex(
      (item) => item.name === productName
    );

    // Calculate total quantity if item exists
    const totalQuantity =
      existingItemIndex >= 0 ? cart[existingItemIndex].quantity + count : count;

    if (totalQuantity > MAX_QUANTITY) {
      alert(
        `You can't add more than ${MAX_QUANTITY} of this product to your cart.`
      );
      return;
    }

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += count;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        quantity: count,
        image: productImage,
      });
    }

    saveCartToStorage();
    updateCart();
    openCartDrawer();
    resetCounter();
  });

  // Cart drawer controls
  function openCartDrawer() {
    cartDrawer.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeDrawerBtn.addEventListener("click", closeCartDrawer);
  overlay.addEventListener("click", closeCartDrawer);

  // Update cart display
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-actions">
              <button class="decrease-quantity">-</button>
              <span>${item.quantity}</span>
              <button class="increase-quantity">+</button>
            </div>
          </div>
          <span class="remove-item" data-index="${index}">&#128465;</span>
        `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to new buttons
    document.querySelectorAll(".decrease-quantity").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index =
          this.closest(".cart-item").querySelector(".remove-item").dataset
            .index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCartToStorage();
          updateCart();
        }
      });
    });

    document.querySelectorAll(".increase-quantity").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index =
          this.closest(".cart-item").querySelector(".remove-item").dataset
            .index;
        if (cart[index].quantity < MAX_QUANTITY) {
          cart[index].quantity++;
          saveCartToStorage();
          updateCart();
        } else {
          alert(`Maximum quantity per product is ${MAX_QUANTITY}`);
        }
      });
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        cart.splice(index, 1);
        saveCartToStorage();
        updateCart();
      });
    });
  }

  // Save cart to localStorage
  function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function resetCounter() {
    count = 1;
    counter.textContent = count;
  }
});
