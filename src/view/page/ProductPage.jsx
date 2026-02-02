import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPriceAmount } from '../../utils/price';
import { STORE_NAME } from '../../constants/store';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Badge,
  IconButton,
  Box,
  Chip,
  InputBase,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BoltIcon from '@mui/icons-material/Bolt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useProductViewModel } from '../../viewModel/useProductViewModel';
import { useCheckoutViewModel } from '../../viewModel/useCheckoutViewModel';
import { incrementCartItem, decrementCartItem } from '../../models/productSlice';
import { CartModal } from '../components/CartModal';
import { PaymentModal } from '../components/PaymentModal';
import { SummaryBackdrop } from '../components/SummaryBackdrop';

const CONTENT_MAX_WIDTH = 1280; // max-w-7xl

export const ProductPage = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, searchTerm, setSearchTerm, cartTotalItems, handleAddToCart } = useProductViewModel();
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
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                {STORE_NAME}
              </Typography>
            </Box>
            {isMd && (
              <Box sx={{ flex: 1, maxWidth: 448, mx: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '9999px',
                    bgcolor: 'action.hover',
                    px: 1.5,
                    py: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  <InputBase
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ fontSize: 14 }}
                    fullWidth
                  />
                </Box>
              </Box>
            )}
            <IconButton onClick={() => setCartModalOpen(true)} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }} aria-label="Ver carrito">
              <Badge badgeContent={cartTotalItems} color="primary" sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: 10 } }}>
                <ShoppingCartIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>
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
        productList={products}
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

      <Box component="header" sx={{ py: 6, textAlign: 'center' }}>
        <Container maxWidth="xl" sx={{ maxWidth: CONTENT_MAX_WIDTH }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
            Productos Destacados
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 672, mx: 'auto', fontSize: '1.125rem' }}>
            Explora nuestra colección de calzado de élite diseñada para llevar tu rendimiento al siguiente nivel.
          </Typography>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          pb: 10,
          maxWidth: CONTENT_MAX_WIDTH,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: 4,
          }}
        >
          {products.map((product, index) => (
            <Card
              key={product.id}
              component={Link}
              to={`/products/${product.id}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                textDecoration: 'none',
                color: 'inherit',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                  '& .card-media': { transform: 'scale(1.05)' },
                },
              }}
            >
              <Box sx={{ position: 'relative', aspectRatio: '1/1', bgcolor: 'action.hover', overflow: 'hidden' }}>
                <CardMedia
                  className="card-media"
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <Chip
                  label={product.category ?? 'Producto'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '9999px',
                    py: 1,
                    px: 1.5,
                  }}
                />
                {index === 1 && (
                  <Chip
                    label="Novedad"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'error.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      borderRadius: '9999px',
                      py: 1,
                      px: 1.5,
                    }}
                  />
                )}
                {product.stock === 0 && index !== 1 && (
                  <Chip
                    label="Agotado"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'error.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 10,
                      textTransform: 'uppercase',
                      borderRadius: '9999px',
                      py: 1,
                      px: 1.5,
                    }}
                  />
                )}
                {product.stock > 0 && product.stock <= 3 && index !== 1 && (
                  <Chip
                    label="Últimas unidades"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'warning.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 10,
                      borderRadius: '9999px',
                      py: 1,
                      px: 1.5,
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1.5, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  component="h2"
                >
                  {product.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${getPriceAmount(product.price).toLocaleString('es-CO')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: 14, mb: 3 }}>
                  <Inventory2Icon sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography variant="body2">
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={product.stock === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: '0 10px 15px -3px rgba(26, 35, 126, 0.2), 0 4px 6px -2px rgba(26, 35, 126, 0.1)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 10px 15px -3px rgba(26, 35, 126, 0.3), 0 4px 6px -2px rgba(26, 35, 126, 0.2)',
                    },
                  }}
                >
                  {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 6,
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: CONTENT_MAX_WIDTH }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                {STORE_NAME}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Typography component="a" href="#" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 14, '&:hover': { color: 'primary.main' } }}>
                Términos y Condiciones
              </Typography>
              <Typography component="a" href="#" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 14, '&:hover': { color: 'primary.main' } }}>
                Política de Privacidad
              </Typography>
              <Typography component="a" href="#" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 14, '&:hover': { color: 'primary.main' } }}>
                Contacto
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center', fontSize: 14, color: 'text.secondary' }}>
            © 2024 {STORE_NAME}. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
