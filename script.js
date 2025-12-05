// ==============================
// MAIN CART ARRAY
// ==============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
        console.error("LocalStorage error:", e);
    }
}

// ===============================
// ADD TO CART WITH QUANTITY
// ===============================
function addToCart(name, price, qty) {
    if (isNaN(price) || price <= 0) {
        alert("Invalid item price.");
        return;
    }
    if (qty > 50) {
        alert("Maximum quantity per addition is 50.");
        return;
    }

    const existingItem = cart.find(item => item.name === name && item.price === price);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    try {
        saveCart();
    } catch (e) {
        alert("Error saving cart. Please check your browser storage.");
    }
    alert(`${qty}x ${name} added to cart!`);
    updateCartBadge();
}

// ===============================
// INCREASE QUANTITY IN CART
// ===============================
function increaseQty(index) {
    cart[index].qty++;
    saveCart();
    loadCart();
    updateCartBadge();
}

// ===============================
// DECREASE QUANTITY IN CART
// ===============================
function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        removeItem(index);
        return;
    }
    saveCart();
    loadCart();
    updateCartBadge();
}

// ===============================
// LOAD CART PAGE
// ===============================
function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceTag = document.getElementById("total-price");

    if (!cartItemsContainer || !totalPriceTag) return; // safety check

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.name} - ₱${item.price} each</span>
            <div class="qty-box">
                <button class="minus" onclick="decreaseQty(${index})">-</button>
                <span class="qty">${item.qty}</span>
                <button class="plus" onclick="increaseQty(${index})">+</button>
            </div>
            <span>Subtotal: ₱${subtotal}</span>
            <button class="remove-btn" onclick="removeItem(${index})">Remove All</button>
        `;

        cartItemsContainer.appendChild(div);

        total += subtotal;
    });

    totalPriceTag.textContent = `Total: ₱${total}`;
}

// ===============================
// REMOVE SPECIFIC ITEM 
// ===============================
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    loadCart();
    updateCartBadge();
}

// ===============================
// PURCHASE FUNCTION
// ===============================
function purchase() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert("Purchase Successful!");
    cart = [];
    saveCart();
    loadCart();
    updateCartBadge();
}

// ===============================
// UPDATE CART BADGE IN NAV
// ===============================
function updateCartBadge() {
    const cartLink = document.getElementById("cart-link");
    if (!cartLink) return;

    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartLink.textContent = `Cart (${totalItems})`;
}

// ===============================
// AUTOLOAD CART PAGE AND BADGE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    if (window.location.pathname.includes("cart.html")) {
        loadCart();
    }
});

// ===============================
// MENU PAGE QUANTITY CONTROLS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const items = document.querySelectorAll(".item");

    items.forEach(item => {
        let qty = 1;
        const qtySpan = item.querySelector(".qty");

        const plusBtn = item.querySelector(".plus");
        const minusBtn = item.querySelector(".minus");
        const addBtn = item.querySelector(".add-btn");

        if (!plusBtn || !minusBtn || !addBtn) return;

        plusBtn.addEventListener("click", () => {
            qty++;
            qtySpan.textContent = qty;
        });

        minusBtn.addEventListener("click", () => {
            if (qty > 1) qty--;
            qtySpan.textContent = qty;
        });

        addBtn.addEventListener("click", () => {
            const name = addBtn.dataset.name;
            const price = Number(addBtn.dataset.price);

            addToCart(name, price, qty);

            qty = 1;
            qtySpan.textContent = 1;
        });
    });


});
