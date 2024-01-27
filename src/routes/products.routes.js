const { Router } = require("express");
const router = Router();

// Ruta /products
router.get('/', async (req, res) => {
    try {
        const products = await req.app.locals.productManager.getProducts();
        const limit = req.query.limit;

        if (limit) {
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving product: ${error}`);
    }
});

// Ruta /products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        if (isNaN(pid)) {
            res.status(400).send('id must be a number');
        }
        const product = await req.app.locals.productManager.getProductById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving product: ${error}`);
    }
});

router.post(`/`, async (req, res) => {
    try {
        const newProduct = req.body;
        console.log("newProduct:", newProduct);

        const product = await req.app.locals.productManager.addProduct(newProduct);

        res.json({
            ok: true,
            message: `product added`,
            product: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error adding product: ${error}`);
    }
});

router.put(`/:id`, async (req, res) => {
    try {
        const productId = req.params.id;
        const modProduct = req.body;
        console.log("id", productId);
        console.log("modProduct:", modProduct);

        const product = await req.app.locals.productManager.updateProduct(productId, modProduct);

        res.json({
            ok: true,
            message: `product updated`,
            product: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error updating product: ${error}`);
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("id", productId);
        await req.app.locals.productManager.deleteProduct(productId);
        res.json({
            ok: true,
            message: `product deleted`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting product: ${error}`);
    }
});

module.exports = router;