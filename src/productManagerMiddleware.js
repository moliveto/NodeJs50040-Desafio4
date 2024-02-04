import ProductManager from "./productmanager.js";

const initializeProductManager = async (req, res, next) => {
    try {
        if (!req.app.locals.productManager) {
            req.app.locals.productManager = await new ProductManager('./products.json');
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing ProductManager');
    }
};

export default initializeProductManager;
