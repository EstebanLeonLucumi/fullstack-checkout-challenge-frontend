import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, addToCart } from '../models/productSlice';
import { toast } from 'sonner';

export const useProductViewModel = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const products = useSelector((state) => state.products.list);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const cart = useSelector((state) => state.products.cart);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.trim().toLowerCase();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Sin stock disponible');
      return;
    }
    dispatch(addToCart(product));
    toast.success(`${product.name} añadido al carrito`);
  };

  return {
    products: filteredProducts,
    searchTerm,
    setSearchTerm,
    isLoading: status === 'loading',
    error,
    cartTotalItems,
    handleAddToCart,
  };
};
