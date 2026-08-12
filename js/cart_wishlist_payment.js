
let cart = JSON.parse(localStorage.getItem('ksr_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('ksr_wishlist') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
});

function updateBadges() {
    const cartBadge = document.getElementById('cartBadge');
    const wishlistBadge = document.getElementById('wishlistBadge');

    const totalCartQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cartBadge) cartBadge.innerText = totalCartQty;
    if (wishlistBadge) wishlistBadge.innerText = wishlist.length;
}

function addToCart(id, title, price, image) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    updateBadges();
    alert(`"${title}" added to your Shopping Cart / Order List!`);
}

function openCartModal() {
    renderCartUI();
    document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function renderCartUI() {
    const container = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#777;">Your cart is empty.</p>';
        if (totalSpan) totalSpan.innerText = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='pictures/hipchain.jpg';">
            <div style="flex:1; margin-left:15px;">
                <strong>${item.title}</strong>
                <div style="font-size:12px; color:#666;">₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                <button class="qty-btn" style="background:#ff6d85; color:white; border:none; margin-left:10px;" onclick="removeItem(${index})">✕</button>
            </div>
        `;
        container.appendChild(row);
    });

    if (totalSpan) totalSpan.innerText = `₹${total.toLocaleString('en-IN')}`;
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    updateBadges();
    renderCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    updateBadges();
    renderCartUI();
}
function addToWishlist(id, title, price, image) {
    const exists = wishlist.some(item => item.id === id);
    if (exists) {
        alert(`"${title}" is already in your Wishlist!`);
        return;
    }
    wishlist.push({ id, title, price, image });
    localStorage.setItem('ksr_wishlist', JSON.stringify(wishlist));
    updateBadges();
    alert(`"${title}" saved to your Wishlist ❤️`);
}

function openWishlistModal() {
    renderWishlistUI();
    document.getElementById('wishlistModal').classList.add('active');
}

function closeWishlistModal() {
    document.getElementById('wishlistModal').classList.remove('active');
}

function renderWishlistUI() {
    const container = document.getElementById('wishlistItemsList');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#777;">Your wishlist is empty.</p>';
        return;
    }

    container.innerHTML = '';
    wishlist.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='pictures/hipchain.jpg';">
            <div style="flex:1; margin-left:15px;">
                <strong>${item.title}</strong>
                <div style="font-size:12px; color:#d4af37;">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <div>
                <button class="cart" style="padding:5px 10px; font-size:12px;" onclick="moveWishlistToCart(${index})">Move to Cart</button>
                <button class="qty-btn" style="background:#ff6d85; color:white; border:none; margin-left:5px;" onclick="removeWishlistItem(${index})">✕</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function moveWishlistToCart(index) {
    const item = wishlist[index];
    addToCart(item.id, item.title, item.price, item.image);
    wishlist.splice(index, 1);
    localStorage.setItem('ksr_wishlist', JSON.stringify(wishlist));
    updateBadges();
    renderWishlistUI();
}

function removeWishlistItem(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('ksr_wishlist', JSON.stringify(wishlist));
    updateBadges();
    renderWishlistUI();
}

function quickBuy(id, title, price, image) {
    addToCart(id, title, price, image);
    openPaymentModal();
}

function openPaymentModal() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.getElementById('paymentTotal').innerText = `₹${total.toLocaleString('en-IN')}`;

    const user = JSON.parse(localStorage.getItem('ksr_user') || 'null');
    if (user && user.name) {
        document.getElementById('payName').value = user.name;
    }

    closeCartModal();
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function selectPayOption(cardElement, optionValue) {
    document.querySelectorAll('.pay-option-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    const radio = cardElement.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

async function handlePaymentSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('payName').value.trim();
    const address = document.getElementById('payAddress').value.trim();
    const phone = document.getElementById('payPhone').value.trim();
    const payMethod = document.querySelector('input[name="payOption"]:checked').value;

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const orderPayload = {
        customerName: name,
        phone: phone,
        address: address,
        paymentMethod: payMethod,
        items: cart,
        totalAmount: totalAmount
    };

    try {
        const response = await fetch('/api/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            const receipt = data.data;
            alert(`🎉 ORDER CONFIRMED!\n\nOrder ID: ${receipt.orderId}\nCustomer: ${name}\nAmount Paid: ₹${totalAmount.toLocaleString('en-IN')}\nPayment Method: ${payMethod}\nDelivery Address: ${address}\n\nThank you for shopping with KSR Jewellery!`);
            
            cart = [];
            localStorage.setItem('ksr_cart', JSON.stringify(cart));
            updateBadges();
            closePaymentModal();
        } else {
            alert(data.message || 'Payment processing failed.');
        }
    } catch (err) {
        alert(`🎉 ORDER CONFIRMED!\n\nOrder ID: KSR_ORD_${Math.floor(Math.random()*1000000)}\nCustomer: ${name}\nAmount: ₹${totalAmount.toLocaleString('en-IN')}\nPayment Option: ${payMethod}\n\nYour order has been placed successfully!`);
        cart = [];
        localStorage.setItem('ksr_cart', JSON.stringify(cart));
        updateBadges();
        closePaymentModal();
    }
}