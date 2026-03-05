import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '../pages/root';
import { HomePage } from '../pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
