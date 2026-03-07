import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { store } from './store';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl",
            title: "font-black text-slate-900",
            description: "text-slate-600 font-medium",
          },
        }}
      />
    </QueryClientProvider>
  </Provider>
);
