document.addEventListener('DOMContentLoaded', loadStock);

async function loadStock() {
    const res = await fetch('/api/admin/jewelry');
    const data = await res.json();
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    if (data.data) {
        data.data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.imageUrl}" width="50" height="50"></td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>₹${item.price}</td>
                <td>
                    <button onclick="deleteItem(${item.id})" style="background:#e63946; color:#fff; border:none; padding:5px 10px; cursor:pointer;">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function openModal() { document.getElementById('addModal').style.display = 'flex'; }
function closeModal() { document.getElementById('addModal').style.display = 'none'; }

document.getElementById('stockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const fileInput = document.getElementById('picture');
    let imageUrl = document.getElementById('imageUrl').value || 'pictures/jewl2.jpg';

    if (fileInput.files[0]) {
        const formData = new FormData();
        formData.append('picture', fileInput.files[0]);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.data) imageUrl = uploadData.data;
    }

    await fetch('/api/admin/jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, price, imageUrl })
    });

    closeModal();
    loadStock();
});

async function deleteItem(id) {
    if (confirm('Delete item?')) {
        await fetch(`/api/admin/jewelry/${id}`, { method: 'DELETE' });
        loadStock();
    }
}