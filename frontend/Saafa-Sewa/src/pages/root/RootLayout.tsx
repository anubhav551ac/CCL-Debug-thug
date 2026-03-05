import { Outlet } from 'react-router-dom';

export const RootLayout = () => (
  <div>
    <main>
      <Outlet />
    </main>
  </div>
);
