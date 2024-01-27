const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.isInitialized = false;

        // Devolver una promesa para la inicialización
        return new Promise((resolve, reject) => {
            this.readFromFile()
                .then(() => {
                    this.isInitialized = true;
                    resolve(this);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async addCart(cart) {
        // Generar ID automático para el carrito
        const id = this.generateCartId();
        cart.id = id;

        // Validar que todos los campos obligatorios estén presentes
        const requiredFields = ['products', 'quantity'];
        const missingFields = requiredFields.filter(field => !cart.hasOwnProperty(field));
        if (missingFields.length > 0) {
            throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        }

        // Guardar el carrito en el arreglo
        this.carts.push(cart);

        // Guardar el arreglo en el archivo
        await this.writeToFile();

        return cart;
    }

    generateCartId() {
        // Calcular el nuevo ID basado en la longitud del arreglo de carritos
        return this.carts.length + 1;
    }

    async getCarts() {
        return this.carts;
    }

    async getCartById(id) {
        return this.carts.find((cart) => cart.id == id);
    }

    async updateCart(id, cart) {
        // Validar que el carrito exista
        const existingCart = await this.getCartById(id);
        if (!existingCart) {
            throw new Error("El carrito no existe");
        }

        // Actualizar el carrito
        Object.assign(existingCart, cart);

        // Guardar el arreglo en el archivo
        await this.writeToFile();

        return existingCart;
    }

    async deleteCart(id) {
        // Validar que el carrito exista
        const existingCartIndex = this.carts.findIndex((cart) => cart.id == id);
        if (existingCartIndex === -1) {
            throw new Error("El carrito no existe");
        }

        // Eliminar el carrito del arreglo
        this.carts.splice(existingCartIndex, 1);

        // Guardar el arreglo en el archivo
        await this.writeToFile();
    }

    async readFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            console.log("File readed");
        } catch (error) {
            console.error('Error initializing CartManager:', error);
            console.log("File error");
            this.carts = [];
        }
    }

    async writeToFile() {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify(this.carts, null, 2);
                fs.writeFileSync(this.path, data);
                resolve("write Ok");
            } catch (error) {
                reject("write fail", error);
            }
        });
    }
}

module.exports = CartManager;