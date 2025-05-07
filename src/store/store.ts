import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './features/authSlice';
import clientReducer from './features/clientSlice';
import agencyReducer from './features/agencySlice';
import productReducer from './features/productSlice';
import ticketReducer from './features/ticketSlice';
import cartReducer from './features/cartSlice';
import userReducer from './features/userSlice';
import dashboardReducer from './features/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    agency: agencyReducer,
    product: productReducer,
    ticket: ticketReducer,
    cart: cartReducer,
    user: userReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 