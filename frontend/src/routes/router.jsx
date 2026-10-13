import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home/Home';
import Instructors from '../pages/Instructors';
import Classes from '../pages/classes/Classes';
import ClassDetailPage from '../pages/detailClass/DetailClass';
import ArticlesPage from '../pages/ArticlesPage/ArticlesPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import Register from '../pages/Register/Register';
import CartPage from '../pages/cartPage/CartPage';
import Products from '../pages/products/Products';

import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Dashboard/adminDashboard/users/Users';
import DashboardClasses from '../pages/Dashboard/adminDashboard/dashboardClasses/DashboardClasses';
import ComingSoonPage from '../pages/Dashboard/adminDashboard/ComingSoon';
import AdminDashboard from '../pages/Dashboard/adminDashboard/AdminDashboard';
import UserDashboard from '../pages/Dashboard/userDashboard/UserDashboard';
import NotFound from '../pages/NotFound';
import DetailArticles from '../pages/detailArticles/DetailArticles';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'instructors', element: <Instructors /> },
      { path: 'classes', element: <Classes /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'articles/:id', element: <DetailArticles /> },
      { path: 'class/:id', element: <ClassDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <Register /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'products', element: <Products /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'classes', element: <DashboardClasses /> },
      { path: 'payments', element: <ComingSoonPage titleKey="dashboard.payments" /> },
      { path: 'workout-plans', element: <ComingSoonPage titleKey="dashboard.workoutPlans" /> },
      { path: 'diet-plans', element: <ComingSoonPage titleKey="dashboard.dietPlans" /> },
      { path: 'articles', element: <ComingSoonPage titleKey="dashboard.articles" /> },
      { path: 'daily-reports', element: <ComingSoonPage titleKey="dashboard.dailyReports" /> },
      { path: 'monthly-reports', element: <ComingSoonPage titleKey="dashboard.monthlyReports" /> },
      { path: 'analytics', element: <ComingSoonPage titleKey="dashboard.analytics" /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'settings', element: <ComingSoonPage titleKey="dashboard.settings" /> },
      { path: 'user', element: <UserDashboard /> },
    ],
  },
  {
    path: '/logout',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
