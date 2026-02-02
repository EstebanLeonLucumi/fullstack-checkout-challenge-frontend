import api from './axiosConfig';

/**
 * Servicio de clientes - Checkout API
 * GET /customers/:id - Find Customer By Id
 * POST /customers/by-email - Find Customer By Email (body: { email })
 * POST /customers - Create Customer
 */
export const customerService = {
  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response;
  },

  getCustomerByEmail: async (email) => {
    const response = await api.post('/customers/by-email', { email });
    return response;
  },

  createCustomer: async (data) => {
    const response = await api.post('/customers/', {
      email: data.email,
      fullName: data.fullName,
      address: data.address,
      city: data.city,
    });
    return response;
  },
};
