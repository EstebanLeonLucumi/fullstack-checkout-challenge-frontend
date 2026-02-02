import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../api/productService';

// THUNK: La acción asíncrona que consume el servicio
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts();
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? error.message
      );
    }
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      const data = response.data?.data ?? response.data;
      return data ?? null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    cart: [],
    currentProduct: null,
    status: 'idle',
    statusDetail: 'idle',
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      // El stock solo se actualiza cuando se finaliza la transacción en el backend
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item.id !== productId);
    },
    incrementCartItem: (state, action) => {
      const productId = action.payload;
      const item = state.cart.find((i) => i.id === productId);
      if (item) item.quantity += 1;
    },
    decrementCartItem: (state, action) => {
      const productId = action.payload;
      const item = state.cart.find((i) => i.id === productId);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.cart = state.cart.filter((i) => i.id !== productId);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload ?? [];
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.statusDetail = 'loading';
        state.currentProduct = null;
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.statusDetail = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductByIdAsync.rejected, (state) => {
        state.statusDetail = 'failed';
        state.currentProduct = null;
      });
  },
});

export const { addToCart, removeFromCart, incrementCartItem, decrementCartItem, clearCart } = productSlice.actions;
export default productSlice.reducer;
