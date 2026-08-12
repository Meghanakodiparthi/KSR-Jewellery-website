document.addEventListener('DOMContentLoaded', () => {
    loadDynamicStockItems();
});

// Fetch and append new stock pictures from Spring Boot Backend
async function loadDynamicStockItems() {
    try {
        const response = await fetch('/api/jewelry');
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            const grid = document.getElementById('jewelryGrid');
            if (!grid) return;

            // Render all items from database into the responsive grid
            result.data.forEach(item => {
                // Avoid duplicating items if already present
                if (document.getElementById(`jewel-card-${item.id}`)) return;

                const card = document.createElement('div');
                card.className = 'jewel';
                card.id = `jewel-card-${item.id}`;
                card.innerHTML = `
                    <div>
                        <img class="jewelimg" src="${item.imageUrl}" onerror="this.src='pictures/hipchain.jpg';">
                    </div>
                    <div class="titleback">
                        <p style="margin-top:6px; margin-bottom:4px; font-weight:bold; font-size:16px;">${item.title}</p>
                        <p style="font-size:14px; color:#d4af37; margin-bottom:8px; font-weight:bold;">&#x20B9; ${Number(item.price).toLocaleString('en-IN')}</p>
                        <div class="buttonsection">
                            <button class="wishlist-btn" onclick="addToWishlist(${item.id}, '${item.title}', ${item.price}, '${item.imageUrl}')" title="Add to Wishlist">&#9829;</button>
                            <button class="cart" onclick="addToCart(${item.id}, '${item.title}', ${item.price}, '${item.imageUrl}')">Add to cart</button>
                            <button class="cart" onclick="quickBuy(${item.id}, '${item.title}', ${item.price}, '${item.imageUrl}')">Buy</button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.log('Running default stock items. API available on server launch.');
    }
}