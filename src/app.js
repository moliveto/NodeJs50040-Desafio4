const express = require('express');
const cartRoutes = require("./routes/carts.routes");
const productsRoutes = require("./routes/products.routes");
const ProductManager = require("./productmanager");
const CartManager = require("./cartmanager");

const app = express();
const PORT = 3000;
const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/static`, express.static(__dirname + "/public"));

// Middleware para inicializar ProductManager
const initializeProductManager = async (req, res, next) => {
    try {
        if (!app.locals.productManager) {
            app.locals.productManager = await new ProductManager('./products.json');
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing ProductManager');
    }
};

// Middleware para inicializar CartManager
const initializeCartManager = async (req, res, next) => {
    try {
        if (!app.locals.cartManager) {
            app.locals.cartManager = await new CartManager('./cart.json');
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing CartManager');
    }
};

// Products Routes
app.use(`/${API_PREFIX}/products`, initializeProductManager, productsRoutes);

// Cart Routes
app.use(`/${API_PREFIX}/carts`, initializeCartManager, cartRoutes);

app.listen(PORT, () => {
    console.log(`UP AND RUNNING ON PORT: ${PORT}`);
});