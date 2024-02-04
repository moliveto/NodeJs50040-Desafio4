import CartManager from "./cartmanager.js";

const initializeCartManager = async (req, res, next) => {
    try {
        if (!req.app.locals.cartManager) {
            req.app.locals.cartManager = await new CartManager('./cart.json');
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing CartManager');
    }
};

export default initializeCartManager;
