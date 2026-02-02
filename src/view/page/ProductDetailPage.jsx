import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPriceAmount } from '../../utils/price';
import { STORE_NAME } from '../../constants/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  CircularProgress,
  CardMedia,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BoltIcon from '@mui/icons-material/Bolt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { fetchProductByIdAsync, addToCart, incrementCartItem, decrementCartItem } from '../../models/productSlice';
import { toast } from 'sonner';
import { useCheckoutViewModel } from '../../viewModel/useCheckoutViewModel';
import { CartModal } from '../components/CartModal';
import { PaymentModal } from '../components/PaymentModal';
import { SummaryBackdrop } from '../components/SummaryBackdrop';

const CONTENT_MAX_WIDTH = 1280;

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, statusDetail, list: productList } = useSelector((state) => state.products);
  const cartTotalItems = useSelector((state) => state.products.cart.reduce((acc, item) => acc + item.quantity, 0));
  const listForCart = currentProduct
    ? [currentProduct, ...productList.filter((p) => p.id !== currentProduct.id)]
    : productList;
  const {
    cart,
    subtotal,
    baseFee,
    deliveryFee,
    cartTotal,
    loading,
    success,
    lastTransactionId,
    lastDeliveryId,
    lastTransactionTotal,
    submitCheckout,
    resetCheckoutSuccess,
  } = useCheckoutViewModel();

  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchProductByIdAsync(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (success && id) dispatch(fetchProductByIdAsync(id));
  }, [success, id, dispatch]);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    if (currentProduct.stock <= 0) {
      toast.error('Sin stock disponible');
      return;
    }
    dispatch(addToCart(currentProduct));
    toast.success(`${currentProduct.name} añadido al carrito`);
  };

  const handleCartPayWithCard = () => {
    setCartModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentModalConfirm = (data) => {
    setFormData(data);
    setPaymentModalOpen(false);
    setBackdropOpen(true);
  };

  const handlePaymentModalBack = () => {
    setPaymentModalOpen(false);
    setCartModalOpen(true);
  };

  const handleBackdropBack = () => {
    setBackdropOpen(false);
    setPaymentModalOpen(true);
  };

  const handleBackdropPay = async () => {
    if (!formData) return;
    try {
      await submitCheckout(formData.customerData, formData.card);
    } catch (_) {}
  };

  const handleBackToProducts = () => {
    resetCheckoutSuccess();
    setBackdropOpen(false);
    setFormData(null);
    navigate('/products');
  };

  if (statusDetail === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (statusDetail === 'failed' || !currentProduct) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: 1, borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ py: 1.5, px: 2 }}>Volver</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Producto no encontrado</Typography>
          <Button sx={{ mt: 2, py: 1.5, px: 2 }} variant="contained" onClick={() => navigate('/products')}>Ir a productos</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: CONTENT_MAX_WIDTH }}>
          <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
                onClick={() => navigate('/products')}
                sx={{ py: 1.5, px: 2, color: 'text.secondary', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
              >
                Volver
              </Button>
              <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BoltIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', fontSize: '1.125rem' }}>
                  {STORE_NAME}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, borderRadius: '50%' }}>
                <SearchIcon />
              </IconButton>
              <IconButton onClick={() => setCartModalOpen(true)} sx={{ color: 'text.secondary', position: 'relative', '&:hover': { bgcolor: 'action.hover' }, borderRadius: '50%' }} aria-label="Ver carrito">
                <ShoppingCartIcon sx={{ fontSize: 28 }} />
                {cartTotalItems > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      minWidth: 20,
                      height: 20,
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }}
                  >
                    {cartTotalItems}
                  </Box>
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <CartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        subtotal={subtotal}
        cartTotal={cartTotal}
        onPayWithCard={handleCartPayWithCard}
        onIncrease={(productId) => dispatch(incrementCartItem(productId))}
        onDecrease={(productId) => dispatch(decrementCartItem(productId))}
        productList={listForCart}
      />
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handlePaymentModalConfirm}
        onBack={handlePaymentModalBack}
        initialShipping={formData?.shipping}
        initialCard={formData?.card}
      />
      <SummaryBackdrop
        open={backdropOpen}
        onClose={() => setBackdropOpen(false)}
        cart={cart}
        subtotal={subtotal}
        baseFee={baseFee}
        deliveryFee={deliveryFee}
        cartTotal={cartTotal}
        onPay={handleBackdropPay}
        onBack={handleBackdropBack}
        loading={loading}
        success={success}
        lastTransactionId={lastTransactionId}
        lastDeliveryId={lastDeliveryId}
        lastTransactionTotal={lastTransactionTotal}
        onBackToProducts={handleBackToProducts}
      />

      <Container maxWidth="xl" sx={{ py: 6, maxWidth: CONTENT_MAX_WIDTH, px: 3 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              minHeight: 0,
            }}
          >
            {/* Columna izquierda: imagen (siempre a la izquierda) */}
            <Box
              sx={{
                bgcolor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 3, md: 4, lg: 6 },
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 520,
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'primary.main',
                    opacity: 0.05,
                    filter: 'blur(40px)',
                    borderRadius: '50%',
                    zIndex: 0,
                  }}
                />
                <CardMedia
                  component="img"
                  image={currentProduct.image}
                  alt={currentProduct.name}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))',
                    transition: 'transform 0.5s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
              </Box>
            </Box>

            {/* Columna derecha: info (siempre a la derecha) */}
            <Box
              sx={{
                p: { xs: 3, md: 4, lg: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={currentProduct.category ?? 'Producto Premium'}
                  size="small"
                  sx={{
                    px: 1.5,
                    py: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '9999px',
                  }}
                />
              </Box>

              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1.875rem', lg: '3rem' },
                  lineHeight: 1.2,
                }}
              >
                {currentProduct.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography sx={{ fontSize: '1.875rem', fontWeight: 700, color: 'primary.main' }}>
                  ${getPriceAmount(currentProduct.price).toLocaleString('es-CO')}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontSize: 14, fontWeight: 500 }}>
                  <CheckCircleIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  {currentProduct.stock > 0
                    ? `En stock (${currentProduct.stock} disponibles)`
                    : 'Sin stock'}
                </Box>
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, fontSize: '1.125rem', lineHeight: 1.75 }}
              >
                {currentProduct.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  disabled={currentProduct.stock === 0}
                  onClick={handleAddToCart}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    boxShadow: '0 10px 15px -3px rgba(26, 35, 126, 0.2), 0 4px 6px -2px rgba(26, 35, 126, 0.1)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 10px 15px -3px rgba(26, 35, 126, 0.3), 0 4px 6px -2px rgba(26, 35, 126, 0.2)',
                    },
                    '&:active': { transform: 'scale(0.98)' },
                  }}
                >
                  {currentProduct.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'rgba(26, 35, 126, 0.08)',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <LocalShippingIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', color: 'text.primary' }}>
                        Envío Gratis
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11 }} color="text.secondary">
                        En pedidos superiores a $500.000
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'rgba(16, 185, 129, 0.12)',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <VerifiedUserIcon sx={{ color: 'success.main', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', color: 'text.primary' }}>
                        Pago Seguro
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11 }} color="text.secondary">
                        100% transacciones seguras
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box component="footer" sx={{ mt: 8, py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl" sx={{ maxWidth: CONTENT_MAX_WIDTH }}>
          <Typography sx={{ textAlign: 'center', fontSize: 14, color: 'text.secondary' }}>
            © {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
