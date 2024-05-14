import { configureStore } from '@reduxjs/toolkit';
import CartReducer from './redux/CartReducer';

export default store = configureStore({
  reducer: {
    cart: CartReducer,
  },
});
