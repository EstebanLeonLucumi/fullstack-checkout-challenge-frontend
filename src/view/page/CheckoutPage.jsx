import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPriceAmount } from '../../utils/price';
import { STORE_NAME } from '../../constants/store';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useCheckoutViewModel } from '../../viewModel/useCheckoutViewModel';

const CHECKOUT_PRIMARY = '#1e3a8a';
const CHECKOUT_PRIMARY_HOVER = '#172554';
const CHECKOUT_BG = '#f8fafc';
const SUCCESS_GREEN = '#10b981';

const VISA_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9O7cFZQxckx6Dmwxfkq8W9yybrq2fNtOa-_xuOMpQ8PGiwRQP6-zHbIjd_dD_Ibg0keYg4iYr9o4I303hf7axs-miOscK_X_Gl2ZaI4re3ZfFjMNieCREu9iGz_hemZ_S3TvHhkQUh9KEUASLX8rmEzl_G1rJZlTt3ncDBA9dzJOG6n3P4J2KF267pb9yrjK3NEoiP5cR38vUf8GIrRWTTIE0EU6u49sfxclmRToDvkcwiE0TsTaOuHceInhEdS85NpRxF-LXvNmr';
const MC_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcPVrPVdC8E670CJJtiWV5IuI3qQP5C0XrF6jiXGRCWB-NhVfrMncZ0XqKtyXbABsrthPTMLJHbmQ29rmWAIuwUSmlfMABXlYjSH-VCL9eXQYDMUE2WynFPTGjSXMnGhnC8AwY3C94BAlEY3ksavaPgNJk0jxsf9WHiPGitC9Le-TD8t4ZMvUg6cOFQTTzuY8VRglnAWgYxUoaqzdangaQO3FmO4vjkmQqQ_segQMr8MSCSPAkSm_7hOsRCo4ZrUJi27fkRd8ru7fe';

// rounded-lg en el HTML = 8px, bordes no muy redondos
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'white',
    '&:hover, &.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': { borderColor: CHECKOUT_PRIMARY },
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
  },
};

const initialShipping = {
  email: '',
  fullName: '',
  address: '',
  city: '',
};

const initialCard = {
  number: '4242424242424242',
  exp_month: '12',
  exp_year: '24',
  cvc: '123',
  card_holder: 'ESTEBAN LEON LUCUMI',
  installments: 1,
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    baseFee,
    deliveryFee,
    cartTotal,
    loading,
    success,
    lastTransactionTotal,
    lastTransactionId,
    lastDeliveryId,
    submitCheckout,
  } = useCheckoutViewModel();

  const formRef = useRef(null);
  const [shipping, setShipping] = useState(initialShipping);
  const [card, setCard] = useState(initialCard);

  const handleShippingChange = (field) => (e) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCardChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'number') value = value.replace(/\D/g, '').slice(0, 16);
    if (field === 'exp_month') value = value.replace(/\D/g, '').slice(0, 2);
    if (field === 'exp_year') value = value.replace(/\D/g, '').slice(0, 2);
    if (field === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const buildCustomerForApi = () => ({
    email: shipping.email.trim(),
    fullName: shipping.fullName.trim(),
    address: shipping.address.trim(),
    city: shipping.city.trim(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitCheckout(buildCustomerForApi(), card);
    } catch (_) {}
  };

  if (success) {
    const orderId = lastTransactionId != null ? String(lastTransactionId) : '—';
    const deliveryId = lastDeliveryId != null ? String(lastDeliveryId) : '—';
    const totalPaid = (lastTransactionTotal ?? cartTotal).toLocaleString('es-CO');

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: CHECKOUT_BG }}>
        <Box component="header" sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
          <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="span" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 700, color: 'text.primary' }}>
              {STORE_NAME}
            </Typography>
          </Box>
        </Box>

        <Box component="main" sx={{ maxWidth: 768, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 4, sm: 6, md: 8 } }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '16px',
              boxShadow: 6,
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'scaleIn 0.5s ease-out forwards',
                }}
              >
                <CheckCircleIcon sx={{ color: SUCCESS_GREEN, fontSize: 48 }} />
              </Box>
            </Box>

            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
              ¡Pago exitoso!
            </Typography>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, color: 'text.secondary', mb: 4, maxWidth: 448, mx: 'auto' }}>
              Tu transacción se procesó correctamente. Hemos enviado los detalles de tu pedido a tu correo electrónico.
            </Typography>

            <Box
              sx={{
                bgcolor: 'grey.50',
                borderRadius: '12px',
                p: 3,
                mb: 4,
                textAlign: 'left',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  ID del Pedido
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {orderId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  ID del Delivery
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {deliveryId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Total pagado
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: CHECKOUT_PRIMARY }}>
                  ${totalPaid}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate('/products')}
              sx={{
                py: 1.5,
                px: 2,
                fontWeight: 600,
                bgcolor: CHECKOUT_PRIMARY,
                borderRadius: '8px',
                boxShadow: `0 4px 14px ${CHECKOUT_PRIMARY}33`,
                '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER, boxShadow: `0 4px 14px ${CHECKOUT_PRIMARY}4D` },
              }}
            >
              Volver a productos
            </Button>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                borderRadius: '9999px',
                fontSize: 14,
                fontWeight: 500,
                color: SUCCESS_GREEN,
                animation: 'successBounce 1s ease-in-out infinite',
              }}
            >
              <VerifiedIcon sx={{ fontSize: 20 }} />
              <span>¡Pago realizado correctamente!</span>
            </Box>
          </Box>
        </Box>

        <Box component="footer" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: 6, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            © {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: CHECKOUT_PRIMARY } }}>
              Términos
            </Typography>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: CHECKOUT_PRIMARY } }}>
              Privacidad
            </Typography>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: CHECKOUT_PRIMARY } }}>
              Soporte
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (cart.length === 0 && !loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: CHECKOUT_BG }}>
        <Box component="header" sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, height: 64, display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => navigate('/products')} sx={{ py: 1.5, px: 2 }}>Volver</Button>
          </Box>
        </Box>
        <Box sx={{ maxWidth: 400, mx: 'auto', py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>Tu carrito está vacío</Typography>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ py: 1.5, px: 2, bgcolor: CHECKOUT_PRIMARY, '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER } }}>Ir a productos</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: CHECKOUT_BG, color: 'text.primary' }}>
      <Box component="header" sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 50 }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate('/products')}
              sx={{ py: 1.5, px: 2, color: 'text.secondary', fontWeight: 500, textTransform: 'none', fontSize: 14, minWidth: 'auto' }}
            >
              Volver
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ color: CHECKOUT_PRIMARY, fontSize: 32 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{STORE_NAME}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
            <LockIcon sx={{ color: 'success.main', fontSize: 20 }} />
            <span>Pago seguro SSL</span>
          </Box>
        </Box>
      </Box>

      <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 6 }}>
        {/* Dos columnas: izquierda 7/12 (formulario), derecha 5/12 (resumen); gap-12 = 48px */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            alignItems: 'flex-start',
          }}
        >
          {/* Columna izquierda: Datos del cliente + Datos de pago */}
          <Box sx={{ flex: '7 1 0', minWidth: 'min(100%, 420px)', maxWidth: '100%' }}>
            <form id="form-checkout" ref={formRef} onSubmit={handleSubmit}>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>1</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Datos del cliente</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Correo electrónico</Typography>
                    <TextField fullWidth size="small" type="email" placeholder="correo@ejemplo.com" value={shipping.email} onChange={handleShippingChange('email')} required sx={inputSx} />
                  </Box>
                  <Box>
                    <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Nombre completo</Typography>
                    <TextField fullWidth size="small" placeholder="Nombre completo" value={shipping.fullName} onChange={handleShippingChange('fullName')} required sx={inputSx} />
                  </Box>
                  <Box>
                    <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Dirección</Typography>
                    <TextField fullWidth size="small" placeholder="Dirección completa" value={shipping.address} onChange={handleShippingChange('address')} required sx={inputSx} />
                  </Box>
                  <Box>
                    <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Ciudad</Typography>
                    <TextField fullWidth size="small" placeholder="Ciudad" value={shipping.city} onChange={handleShippingChange('city')} required sx={inputSx} />
                  </Box>
                </Box>
              </Box>

              <Box component="hr" sx={{ border: 'none', borderTop: '1px solid', borderColor: 'divider', my: 4 }} />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>2</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Datos de pago</Typography>
                </Box>
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid', borderColor: '#e2e8f0', boxShadow: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Nombre del titular</Typography>
                      <TextField fullWidth size="small" placeholder="Nombre como aparece en la tarjeta" value={card.card_holder} onChange={handleCardChange('card_holder')} required inputProps={{ style: { textTransform: 'uppercase', letterSpacing: 2, fontSize: 14 } }} sx={inputSx} />
                    </Box>
                    <Box>
                      <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Número de tarjeta</Typography>
                      <TextField fullWidth size="small" placeholder="0000 0000 0000 0000" value={card.number.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)} onChange={handleCardChange('number')} required InputProps={{ endAdornment: <InputAdornment position="end" sx={{ opacity: 0.6 }}><Box component="img" alt="Visa" src={VISA_IMG} sx={{ height: 20, mr: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} /><Box component="img" alt="Mastercard" src={MC_IMG} sx={{ height: 20, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} /></InputAdornment> }} sx={[inputSx, { '& .MuiInputBase-input': { pr: 10 } }]} />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>Fecha de vencimiento</Typography>
                        <TextField fullWidth size="small" placeholder="MM / AA" value={[card.exp_month, card.exp_year].filter(Boolean).join(' / ')} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length <= 2) setCard((p) => ({ ...p, exp_month: v, exp_year: '' })); else setCard((p) => ({ ...p, exp_month: v.slice(0, 2), exp_year: v.slice(2, 4) })); }} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.secondary', mb: 0.75 }}>CVV</Typography>
                        <TextField fullWidth size="small" placeholder="123" type="password" value={card.cvc} onChange={handleCardChange('cvc')} required InputProps={{ endAdornment: <InputAdornment position="end"><HelpOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }} sx={inputSx} />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid', borderColor: '#f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <ShieldIcon sx={{ color: 'text.secondary', fontSize: 24, flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.6 }}>Tus datos de pago se cifran con tecnología SSL. No guardamos tu CVV ni datos sensibles de la tarjeta.</Typography>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>

          {/* Columna derecha: Resumen del pedido */}
          <Box sx={{ flex: '5 1 0', minWidth: 'min(100%, 320px)', maxWidth: '100%', position: 'sticky', top: 96 }}>
            <Box sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid', borderColor: '#e2e8f0', p: 3, boxShadow: 1 }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, mb: 3 }}>Resumen del pedido</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ width: 80, height: 80, flexShrink: 0, bgcolor: 'action.hover', borderRadius: 2, overflow: 'hidden' }}>
                      <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.category ?? 'Producto'}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>Cant: {item.quantity}</Typography>
                        <Typography fontWeight={700}>${(getPriceAmount(item.price) * item.quantity).toLocaleString('es-CO')}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3, '& > div': { display: 'flex', justifyContent: 'space-between', py: 0.75, color: 'text.secondary' } }}>
                <Box><Typography variant="body2">Subtotal</Typography><Typography variant="body2">${subtotal.toLocaleString('es-CO')}</Typography></Box>
                <Box><Typography variant="body2">Envío</Typography><Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>Gratis</Typography></Box>
                <Box><Typography variant="body2">Impuesto estimado</Typography><Typography variant="body2">${(baseFee + deliveryFee).toLocaleString('es-CO')}</Typography></Box>
                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', mt: 1 }}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>${cartTotal.toLocaleString('es-CO')}</Typography>
                </Box>
              </Box>
              <Button
                type="button"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                endIcon={!loading ? <ArrowForwardIcon /> : null}
                onClick={() => formRef.current?.requestSubmit()}
                sx={{ mt: 4, py: 1.5, px: 2, fontWeight: 700, fontSize: '1rem', borderRadius: '12px', bgcolor: CHECKOUT_PRIMARY, boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2)', '&:hover': { bgcolor: CHECKOUT_PRIMARY_HOVER, boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.3)' } }}
              >
                {loading ? 'Procesando...' : 'Completar compra'}
              </Button>
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, opacity: 0.6 }}>
                <Box component="img" alt="Visa" src={VISA_IMG} sx={{ height: 24 }} />
                <Box component="img" alt="Mastercard" src={MC_IMG} sx={{ height: 24 }} />
                <Box sx={{ width: 1, height: 32, bgcolor: 'divider' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <VerifiedUserIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, color: 'text.secondary' }}>Conexión segura SSL</Typography>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ mt: 3, textAlign: 'center', fontSize: 12, color: 'text.secondary', px: 2 }}>Al hacer clic en "Completar compra" aceptas nuestros Términos de servicio y Política de privacidad.</Typography>
          </Box>
        </Box>
      </Box>

      <Box component="footer" sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 6, borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Política de privacidad</Typography>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Política de devoluciones</Typography>
            <Typography component="a" href="#" sx={{ fontSize: 14, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Soporte</Typography>
          </Box>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>© {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.</Typography>
        </Box>
      </Box>
    </Box>
  );
};
