import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import userReducer from './userSlice';
import uiReducer from './uiSlice';
import pinsReducer from '../features/pins/pinsSlice';

// Middleware to sync user state with localStorage
const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const state = store.getState() as RootState;
  // Check if the action is from userSlice and modifies the user data
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const type = (action as { type: string }).type;
    if (type === 'user/setUser' || type === 'user/updateUser') {
      if (state.user.user) {
        localStorage.setItem('user', JSON.stringify(state.user.user));
      }
    } else if (type === 'user/clearUser') {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Also ensure token is cleared here as a fallback
    }
  }
  return result;
};

const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    pins: pinsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for accessing user state
export const useUser = () => {
  return useAppSelector((state) => state.user);
};

export { store };
