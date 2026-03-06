import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from '../pages/home';
import { AnimatedLayout } from '../pages/AnimatedLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardLayout from '@/pages/Dashboard/DashboardLayout';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import NewReportPage from '@/pages/Dashboard/NewReportPage';
import LiveMapPage from '@/pages/Dashboard/LiveMapPage';
import ImpactStatsPage from '@/pages/Dashboard/ImpactStatsPage';
import ReportForm from '@/pages/Dashboard/ReportForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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
  {
    path: "/app/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/app/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app/new-report",
        element: <ReportForm />,
      },
      {
        path: "/app/live-map",
        element: <LiveMapPage />,
      },
      {
        path: "/app/impact-stats",
        element: <ImpactStatsPage />,
      },
    ],
  },
]);
