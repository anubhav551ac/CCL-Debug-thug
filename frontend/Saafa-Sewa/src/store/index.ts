import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import userReducer from './userSlice';
import uiReducer from './uiSlice';
import pinsReducer from '../features/pins/pinsSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    pins: pinsReducer,
  },
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
