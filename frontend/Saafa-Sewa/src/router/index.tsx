import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from '../pages/home';
import { AnimatedLayout } from '../pages/AnimatedLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AnimatedLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);
