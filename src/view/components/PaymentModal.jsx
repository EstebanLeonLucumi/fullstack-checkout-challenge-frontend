import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShieldIcon from '@mui/icons-material/Shield';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CHECKOUT_PRIMARY = '#1e3a8a';
const VISA_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9O7cFZQxckx6Dmwxfkq8W9yybrq2fNtOa-_xuOMpQ8PGiwRQP6-zHbIjd_dD_Ibg0keYg4iYr9o4I303hf7axs-miOscK_X_Gl2ZaI4re3ZfFjMNieCREu9iGz_hemZ_S3TvHhkQUh9KEUASLX8rmEzl_G1rJZlTt3ncDBA9dzJOG6n3P4J2KF267pb9yrjK3NEoiP5cR38vUf8GIrRWTTIE0EU6u49sfxclmRToDvkcwiE0TsTaOuHceInhEdS85NpRxF-LXvNmr';
const MC_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcPVrPVdC8E670CJJtiWV5IuI3qQP5C0XrF6jiXGRCWB-NhVfrMncZ0XqKtyXbABsrthPTMLJHbmQ29rmWAIuwUSmlfMABXlYjSH-VCL9eXQYDMUE2WynFPTGjSXMnGhnC8AwY3C94BAlEY3ksavaPgNJk0jxsf9WHiPGitC9Le-TD8t4ZMvUg6cOFQTTzuY8VRglnAWgYxUoaqzdangaQO3FmO4vjkmQqQ_segQMr8MSCSPAkSm_7hOsRCo4ZrUJi27fkRd8ru7fe';

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

const initialShipping = { email: '', fullName: '', address: '', city: '' };
const initialCard = {
  number: '4242424242424242',
  exp_month: '12',
  exp_year: '24',
  cvc: '123',
  card_holder: 'ESTEBAN LEON LUCUMI',
  installments: 1,
};

export const PaymentModal = ({ open, onClose, onConfirm, onBack, initialShipping: initialShippingProp, initialCard: initialCardProp }) => {
  const [shipping, setShipping] = useState(initialShippingProp ?? initialShipping);
  const [card, setCard] = useState(initialCardProp ?? initialCard);

  useEffect(() => {
    if (open) {
      setShipping(initialShippingProp ?? initialShipping);
      setCard(initialCardProp ?? initialCard);
    }
  }, [open, initialShippingProp, initialCardProp]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerData = {
      email: shipping.email.trim(),
      fullName: shipping.fullName.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
    };
    onConfirm({ shipping, card, customerData });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Pagar con tarjeta de crédito</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Datos del cliente</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField fullWidth size="small" type="email" label="Correo electrónico" placeholder="correo@ejemplo.com" value={shipping.email} onChange={handleShippingChange('email')} required sx={inputSx} />
            <TextField fullWidth size="small" label="Nombre completo" value={shipping.fullName} onChange={handleShippingChange('fullName')} required sx={inputSx} />
            <TextField fullWidth size="small" label="Dirección" value={shipping.address} onChange={handleShippingChange('address')} required sx={inputSx} />
            <TextField fullWidth size="small" label="Ciudad" value={shipping.city} onChange={handleShippingChange('city')} required sx={inputSx} />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Datos de pago</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth size="small" label="Nombre del titular" value={card.card_holder} onChange={handleCardChange('card_holder')} required inputProps={{ style: { textTransform: 'uppercase', letterSpacing: 2, fontSize: 14 } }} sx={inputSx} />
            <TextField fullWidth size="small" label="Número de tarjeta" value={card.number.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)} onChange={handleCardChange('number')} required InputProps={{ endAdornment: <InputAdornment position="end" sx={{ opacity: 0.6 }}><Box component="img" alt="Visa" src={VISA_IMG} sx={{ height: 20, mr: 0.5 }} /><Box component="img" alt="Mastercard" src={MC_IMG} sx={{ height: 20 }} /></InputAdornment> }} sx={[inputSx, { '& .MuiInputBase-input': { pr: 10 } }]} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField fullWidth size="small" label="Vencimiento (MM/AA)" value={[card.exp_month, card.exp_year].filter(Boolean).join(' / ')} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length <= 2) setCard((p) => ({ ...p, exp_month: v, exp_year: '' })); else setCard((p) => ({ ...p, exp_month: v.slice(0, 2), exp_year: v.slice(2, 4) })); }} sx={inputSx} />
              <TextField fullWidth size="small" label="CVV" type="password" value={card.cvc} onChange={handleCardChange('cvc')} required InputProps={{ endAdornment: <InputAdornment position="end"><HelpOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }} sx={inputSx} />
            </Box>
          </Box>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <ShieldIcon sx={{ color: 'text.secondary', fontSize: 24, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>Tus datos de pago se cifran con tecnología SSL.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack ?? onClose} sx={{ py: 1.5, px: 2 }}>
            Volver
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button type="submit" variant="contained" sx={{ py: 1.5, px: 2, bgcolor: CHECKOUT_PRIMARY, '&:hover': { bgcolor: '#172554' } }}>Ver resumen</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
