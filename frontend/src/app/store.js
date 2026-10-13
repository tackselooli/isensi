import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import classesReducer from '../features/classes/classesSlice';
import themeReducer from '../features/theme/themeSlice';
import userReducer from '../features/users/userSlice';
import articleReducer from '../features/articles/articleSlice';
import languageReducer from '../features/language/languageSlice';

// Retrieve token from localStorage
const token = localStorage.getItem('token');

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    classes: classesReducer,
    users: userReducer,
    articles: articleReducer,
    theme: themeReducer,
    language: languageReducer,
  },
  preloadedState: {
    auth: {
      token: token ? token : null,
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
