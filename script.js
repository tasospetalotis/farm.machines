document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/') {
        fetch('/products')
            .then(response => response.json())
            .then(products => {
                const productsContainer = document.getElementById('products');
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <img src="/images/${product.image}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <button class="delete" data-id="${product.id}">Delete</button>
                    `;
                    productsContainer.appendChild(productDiv);
                });

                document.querySelectorAll('button.delete').forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        fetch(`/delete-product/${productId}`, { method: 'DELETE' })
                            .then(response => response.ok ? this.parentElement.remove() : alert('Failed to delete product'));
                    });
                });
            });
    }

    if (window.location.pathname === '/dashboard.html') {
        const form = document.getElementById('productForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            fetch('/add-product', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    alert('Product added successfully!');
                    form.reset();
                } else {
                    alert('Failed to add product.');
                }
            });
        });
    }
});
