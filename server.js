const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up storage for images
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load existing products
let products = [];
const productsFilePath = path.join(__dirname, 'products.json');
if (fs.existsSync(productsFilePath)) {
    const productsData = fs.readFileSync(productsFilePath);
    products = JSON.parse(productsData);
}

// Route to get all products
app.get('/products', (req, res) => {
    res.json(products);
});

// Route to add a new product
app.post('/add-product', upload.single('image'), (req, res) => {
    const newProduct = {
        id: Date.now().toString(),
        name: req.body.name,
        description: req.body.description,
        image: req.file.filename
    };
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).send('Product added');
});

// Route to delete a product
app.delete('/delete-product/:id', (req, res) => {
    const productId = req.params.id;
    products = products.filter(product => product.id !== productId);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.send('Product deleted');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
