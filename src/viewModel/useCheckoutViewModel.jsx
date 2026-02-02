import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPriceAmount } from '../utils/price';
import { clearCart, fetchProductsAsync } from '../models/productSlice';
import { customerService } from '../api/customerService';
import { transactionService } from '../api/transactionService';
import { BASE_FEE, DELIVERY_FEE } from '../constants/store';
import { toast } from 'sonner';

export const useCheckoutViewModel = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.products.cart);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastTransactionTotal, setLastTransactionTotal] = useState(null);
  const [lastTransactionId, setLastTransactionId] = useState(null);
  const [lastDeliveryId, setLastDeliveryId] = useState(null);

  const subtotal =
    cart.reduce((acc, item) => acc + getPriceAmount(item.price) * item.quantity, 0) || 0;
  const cartTotal = subtotal + BASE_FEE + DELIVERY_FEE;

  const submitCheckout = async (customerData, cardData) => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      let customerId = null;

      try {
        const existingRes = await customerService.getCustomerByEmail(customerData.email);
        const existing = existingRes.data?.data ?? existingRes.data;
        customerId = existing?.id ?? existing?.customerId;
      } catch (err) {
        if (err.response?.status === 404) {
          const createRes = await customerService.createCustomer(customerData);
          const created = createRes.data?.data ?? createRes.data;
          customerId = created?.id ?? created?.customerId;
        } else {
          throw err;
        }
      }

      if (!customerId) {
        throw new Error('No se obtuvo el ID del cliente');
      }

      const payload = {
        checkout: {
          credit_card: {
            number: cardData.number.replace(/\s/g, ''),
            exp_month: String(cardData.exp_month).padStart(2, '0'),
            exp_year: String(cardData.exp_year).padStart(2, '0'),
            cvc: cardData.cvc,
            card_holder: cardData.card_holder,
          },
          installments: Number(cardData.installments) || 1,
        },
        transaction: {
          customerId,
          transactionProducts: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      };

      const transactionRes = await transactionService.createTransaction(payload);
      const data = transactionRes.data?.data ?? transactionRes.data;
      const status = data?.status;
      const transactionId = data?.id ?? data?.transactionId ?? null;

      if (status === 'APPROVED') {
        setLastTransactionTotal(cartTotal);
        setLastTransactionId(transactionId);
        setLastDeliveryId(data?.deliveryId ?? null);
        dispatch(clearCart());
        dispatch(fetchProductsAsync());
        setSuccess(true);
        toast.success('¡Pago realizado correctamente!');
      } else {
        const errorMsg =
          data?.message ??
          data?.error ??
          'La transacción no fue aprobada. Intenta de nuevo.';
        toast.error(errorMsg);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message;
      toast.error(msg || 'Error al procesar el pago');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetCheckoutSuccess = () => {
    setSuccess(false);
    setLastTransactionId(null);
    setLastDeliveryId(null);
    setLastTransactionTotal(null);
  };

  return {
    cart,
    subtotal,
    baseFee: BASE_FEE,
    deliveryFee: DELIVERY_FEE,
    cartTotal,
    loading,
    success,
    lastTransactionTotal,
    lastTransactionId,
    lastDeliveryId,
    submitCheckout,
    resetCheckoutSuccess,
  };
};
