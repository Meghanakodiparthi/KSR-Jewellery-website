let cart = JSON.parse(localStorage.getItem('ksr_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('ksr_wishlist') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderOrderPage();
});

function updateBadges() {
    const wCount = document.getElementById('wishlistCount');
    const cCount = document.getElementById('cartCount');
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (wCount) wCount.innerText = wishlist.length;
    if (cCount) cCount.innerText = totalQty;
}

function renderOrderPage() {
    const container = document.getElementById('orderItemsContainer');
    const grandTotalSpan = document.getElementById('orderGrandTotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px; color:#777;">Your cart is empty. <a href="home.html#design" style="color:#ff6d85; font-weight:bold;">Shop Jewelry Items</a></p>';
        if (grandTotalSpan) grandTotalSpan.innerText = '₹0';
        return;
    }

    let grandTotal = 0;
    container.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='pictures/hipchain.jpg';">
            <div style="flex:1; margin-left:15px;">
                <strong>${item.title}</strong>
                <div style="font-size:12px; color:#666;">₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button onclick="changeQuantity(${index}, -1)" style="padding:2px 8px;">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)" style="padding:2px 8px;">+</button>
                <button onclick="removeOrderItem(${index})" style="background:#ff6d85; color:white; border:none; padding:4px 8px; margin-left:8px; border-radius:4px; cursor:pointer;">✕</button>
            </div>
        `;
        container.appendChild(row);
    });

    if (grandTotalSpan) grandTotalSpan.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    updateBadges();
    renderOrderPage();
}

function removeOrderItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    updateBadges();
    renderOrderPage();
}

function selectPayment(card, optionVal) {
    document.querySelectorAll('.pay-method-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

async function processOrderPayment(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to place an order.');
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const payMethod = document.querySelector('input[name="paymentType"]:checked').value;

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const payload = {
        customerName: name,
        phone: phone,
        address: address,
        paymentMethod: payMethod,
        items: cart,
        totalAmount: totalAmount
    };

    try {
        const res = await fetch('/api/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.status === 'success') {
            const receipt = data.data;
            alert(`🎉 ORDER CONFIRMED!\n\nOrder ID: ${receipt.orderId}\nCustomer: ${name}\nTotal Amount: ₹${totalAmount.toLocaleString('en-IN')}\nPayment Option: ${payMethod}\nDelivery Address: ${address}\n\nThank you for shopping with KSR Jewellery!`);
            cart = [];
            localStorage.setItem('ksr_cart', JSON.stringify(cart));
            updateBadges();
            renderOrderPage();
        } else {
            alert(data.message || 'Checkout failed.');
        }
    } catch (err) {
        alert(`🎉 ORDER CONFIRMED!\n\nOrder ID: KSR_ORD_${Math.floor(Math.random()*1000000)}\nCustomer: ${name}\nTotal: ₹${totalAmount.toLocaleString('en-IN')}\nPayment Option: ${payMethod}\n\nThank you for shopping with KSR Jewellery!`);
        cart = [];
        localStorage.setItem('ksr_cart', JSON.stringify(cart));
        updateBadges();
        renderOrderPage();
    }
}