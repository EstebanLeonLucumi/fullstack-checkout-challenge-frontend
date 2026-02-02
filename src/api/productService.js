import api from './axiosConfig';

/**
 * Servicio de productos - Checkout API
 * GET /products - Find All Products
 * GET /products/:id - Find Product By Id
 */
export const productService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
  },
};
