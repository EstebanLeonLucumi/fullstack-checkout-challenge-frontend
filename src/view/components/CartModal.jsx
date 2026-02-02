import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { getPriceAmount } from '../../utils/price';
import { BASE_FEE, DELIVERY_FEE } from '../../constants/store';

const CHECKOUT_PRIMARY = '#1e3a8a';
const CHECKOUT_PRIMARY_HOVER = '#172554';

export const CartModal = ({ open, onClose, cart, subtotal, cartTotal, onPayWithCard, onIncrease, onDecrease, productList = [] }) => {
  const deliveryFee = DELIVERY_FEE;
  const baseFee = BASE_FEE;
  const total = cartTotal ?? (subtotal + baseFee + deliveryFee);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCartIcon />
        Carrito
      </DialogTitle>
      <DialogContent dividers>
        {cart.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>Tu carrito está vacío</Typography>
            <Typography variant="body2" color="text.secondary">Agrega productos desde la tienda para continuar.</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              {cart.map((item) => {
                const productFromList = productList.find((p) => p.id === item.id);
                const maxStock = productFromList?.stock ?? item.stock ?? 0;
                const canIncrease = onIncrease && item.quantity < maxStock;
                return (
                  <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ width: 56, height: 56, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
                      <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.category ?? 'Producto'}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {onDecrease && (
                            <IconButton
                              size="small"
                              onClick={() => onDecrease(item.id)}
                              sx={{ p: 0.5, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
                              aria-label="Disminuir cantidad"
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                          {onIncrease && (
                            <IconButton
                              size="small"
                              onClick={() => onIncrease(item.id)}
                              disabled={!canIncrease}
                              sx={{ p: 0.5, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, '&.Mui-disabled': { opacity: 0.5 } }}
                              aria-label="Aumentar cantidad"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                        <Typography variant="body2" fontWeight={700}>${(getPriceAmount(item.price) * item.quantity).toLocaleString('es-CO')}</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.5 } }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">${(subtotal || 0).toLocaleString('es-CO')}</Typography>
            </Box>
            <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.5 } }}>
              <Typography variant="body2" color="text.secondary">Envío</Typography>
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>Gratis</Typography>
            </Box>
            <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.5 } }}>
              <Typography variant="body2" color="text.secondary">Impuesto estimado</Typography>
              <Typography variant="body2">${(baseFee + deliveryFee).toLocaleString('es-CO')}</Typography>
            </Box>
            <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider', mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: CHECKOUT_PRIMARY }}>${(total || 0).toLocaleString('es-CO')}</Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', gap: 1, '& .MuiDialogActions-root': { flexDirection: 'column' } }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onClose} fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, px: 2 }}>
          Volver
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<CreditCardIcon />}
          onClick={() => {
            onPayWithCard();
            onClose();
          }}
          disabled={cart.length === 0}
          sx={{ py: 1.5, px: 2, bgcolor: CHECKOUT_PRIMARY, '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER } }}
        >
          Pagar con tarjeta de crédito
        </Button>
      </DialogActions>
    </Dialog>
  );
};
