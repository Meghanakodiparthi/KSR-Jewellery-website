let wishlist = JSON.parse(localStorage.getItem('ksr_wishlist') || '[]');
let cart = JSON.parse(localStorage.getItem('ksr_cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderWishlist();
});

function updateBadges() {
    const wCount = document.getElementById('wishlistCount');
    const cCount = document.getElementById('cartCount');
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (wCount) wCount.innerText = wishlist.length;
    if (cCount) cCount.innerText = totalQty;
}

function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) return;

    if (wishlist.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px; color:#777;">Your Wishlist is empty. <a href="home.html#design" style="color:#ff6d85; font-weight:bold;">Browse Jewelry Collections</a></div>';
        return;
    }

    grid.innerHTML = '';
    wishlist.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'wishlist-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='pictures/hipchain.jpg';">
            <div class="wishlist-card-body">
                <strong>${item.title}</strong>
                <span style="color:#d4af37; font-weight:bold;">₹${item.price.toLocaleString('en-IN')}</span>
                <button class="move-btn" onclick="moveToCart(${index})">Move to Cart / Order List</button>
                <button class="remove-btn" onclick="removeWishlist(${index})">Remove</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function moveToCart(index) {
    const item = wishlist[index];
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: item.id, title: item.title, price: item.price, image: item.image, quantity: 1 });
    }
    wishlist.splice(index, 1);
    localStorage.setItem('ksr_cart', JSON.stringify(cart));
    localStorage.setItem('ksr_wishlist', JSON.stringify(wishlist));
    updateBadges();
    renderWishlist();
    alert(`"${item.title}" moved to Cart / Order List!`);
}

function removeWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('ksr_wishlist', JSON.stringify(wishlist));
    updateBadges();
    renderWishlist();
}