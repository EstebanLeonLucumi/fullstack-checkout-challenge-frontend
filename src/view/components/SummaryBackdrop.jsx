import React from 'react';
import { Backdrop, Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { getPriceAmount } from '../../utils/price';

const CHECKOUT_PRIMARY = '#1e3a8a';
const CHECKOUT_PRIMARY_HOVER = '#172554';
const SUCCESS_GREEN = '#10b981';

export const SummaryBackdrop = ({
  open,
  onClose,
  cart,
  subtotal,
  baseFee,
  deliveryFee,
  cartTotal,
  onPay,
  onBack,
  loading,
  success,
  lastTransactionId,
  lastDeliveryId,
  lastTransactionTotal,
  onBackToProducts,
}) => {
  const orderId = lastTransactionId != null ? String(lastTransactionId) : '—';
  const deliveryId = lastDeliveryId != null ? String(lastDeliveryId) : '—';
  const totalPaid = (lastTransactionTotal ?? cartTotal).toLocaleString('es-CO');

  return (
    <Backdrop open={open} sx={{ zIndex: 1300, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 6,
          maxWidth: 480,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3,
        }}
      >
        {success ? (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <CheckCircleIcon sx={{ color: SUCCESS_GREEN, fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>¡Pago exitoso!</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Tu transacción se procesó correctamente.</Typography>
            </Box>
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 2, mb: 3, '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.75 } }}>
              <Box><Typography variant="body2" color="text.secondary">ID del Pedido</Typography><Typography variant="body2" fontWeight={700}>{orderId}</Typography></Box>
              <Box><Typography variant="body2" color="text.secondary">ID del Delivery</Typography><Typography variant="body2" fontWeight={700}>{deliveryId}</Typography></Box>
              <Box><Typography variant="body2" color="text.secondary">Total pagado</Typography><Typography variant="body2" fontWeight={700} sx={{ color: CHECKOUT_PRIMARY }}>${totalPaid}</Typography></Box>
            </Box>
            <Button fullWidth variant="contained" startIcon={<ShoppingBagIcon />} onClick={onBackToProducts} sx={{ py: 1.5, px: 2, fontWeight: 600, bgcolor: CHECKOUT_PRIMARY, '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER } }}>Volver a productos</Button>
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, mb: 2 }}>Resumen del pedido</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2, maxHeight: 200, overflow: 'auto' }}>
              {cart.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
                    <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Cant: {item.quantity} · ${(getPriceAmount(item.price) * item.quantity).toLocaleString('es-CO')}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.5, typography: 'body2', color: 'text.secondary' } }}>
              <Box><Typography variant="body2" color="text.secondary">Subtotal</Typography><Typography variant="body2">${subtotal.toLocaleString('es-CO')}</Typography></Box>
              <Box><Typography variant="body2" color="text.secondary">Envío</Typography><Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>Gratis</Typography></Box>
              <Box><Typography variant="body2" color="text.secondary">Impuesto estimado</Typography><Typography variant="body2">${(baseFee + deliveryFee).toLocaleString('es-CO')}</Typography></Box>
              <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider', mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: CHECKOUT_PRIMARY }}>${cartTotal.toLocaleString('es-CO')}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
              {onBack && (
                <Button startIcon={<ArrowBackIcon />} onClick={onBack} fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, px: 2 }}>
                  Volver
                </Button>
              )}
              <Button
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                endIcon={!loading ? <ArrowForwardIcon /> : null}
                onClick={onPay}
                sx={{ py: 1.5, px: 2, fontWeight: 700, bgcolor: CHECKOUT_PRIMARY, '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER } }}
              >
                {loading ? 'Procesando...' : 'Pagar'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Backdrop>
  );
};
