const { Router } = require("express");
const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await req.app.locals.cartManager.getCarts();
        const limit = req.query.limit;

        if (limit) {
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        if (isNaN(pid)) {
            res.status(400).send('id must be a number');
        }
        const product = await req.app.locals.cartManager.getCartById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.post(`/`, async (req, res) => {
    try {

        const newProduct = req.body;
        console.log("newProduct:", newProduct);

        const product = await req.app.locals.cartManager.addCart(newProduct);

        res.json({
            ok: true,
            message: `cart added`,
            product: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error adding cart: ${error}`);
    }
});

router.put(`/:id`, async (req, res) => {
    try {
        const productId = req.params.id;
        const modProduct = req.body;
        console.log("id", productId);
        console.log("modProduct:", modProduct);

        const product = await req.app.locals.cartManager.updateCart(productId, modProduct);

        res.json({
            ok: true,
            message: `product updated`,
            product: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error updating cart: ${error}`);
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("id", productId);
        await req.app.locals.cartManager.deleteCart(productId);
        res.json({
            ok: true,
            message: `product deleted`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting cart: ${error}`);
    }
});

module.exports = router;