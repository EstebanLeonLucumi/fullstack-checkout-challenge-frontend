import api from './axiosConfig';

/**
 * Servicio de transacciones - Checkout API
 * POST /transactions/checkout - Create Transaction (checkout con tarjeta)
 *
 * Body esperado por el backend:
 * {
 *   checkout: {
 *     credit_card: { number, exp_month, exp_year, cvc, card_holder },
 *     installments
 *   },
 *   transaction: {
 *     customerId,
 *     transactionProducts: [ { productId, quantity } ]
 *   }
 * }
 */
export const transactionService = {
  createTransaction: async (payload) => {
    const response = await api.post('/transactions/checkout', payload);
    return response;
  },
};
