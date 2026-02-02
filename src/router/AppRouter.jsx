import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProductPage } from '../view/page/ProductPage';
import { ProductDetailPage } from '../view/page/ProductDetailPage';
import { CheckoutPage } from '../view/page/CheckoutPage';

export const router = createBrowserRouter([
  {
    path: '/products',
    element: <ProductPage />,
  },
  {
    path: '/products/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/*',
    element: <Navigate to="/products" />,
  },
]);
