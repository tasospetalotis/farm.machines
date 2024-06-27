document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products');
    const productForm = document.getElementById('productForm');
    const productsKey = 'farmMachines';

    let products = JSON.parse(localStorage.getItem(productsKey)) || [];

    const renderProducts = () => {
        productsContainer.innerHTML = '';
        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <button class="delete" data-index="${index}">Delete</button>
            `;
            productsContainer.appendChild(productDiv);
        });

        document.querySelectorAll('button.delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                products.splice(index, 1);
                localStorage.setItem(productsKey, JSON.stringify(products));
                renderProducts();
            });
        });
    };

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = e.target.result;
                products.push({ name, description, image });
                localStorage.setItem(productsKey, JSON.stringify(products));

                productForm.reset();
                renderProducts();
            };
            reader.readAsDataURL(imageFile);
        }
    });

    renderProducts();
});
