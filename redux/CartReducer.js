import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'Cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      state.cart = removeItem;
    },

    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      itemPresent.quantity++;
    },

    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
      } else {
        itemPresent.quantity--;
      }
    },

    cleanCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decrementQuantity,
  incrementQuantity,
  cleanCart,
} = CartSlice.actions;

export default CartSlice.reducer;
