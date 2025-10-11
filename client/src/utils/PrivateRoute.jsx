import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole, hasPermission } from './roleCheck';

/**
 * Basic Private Route - requires authentication
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

/**
 * Role-based Private Route
 */
export const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAll = false 
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = requireAll 
    ? allowedRoles.every(role => hasRole(user, role))
    : allowedRoles.some(role => hasRole(user, role));

  if (!hasAccess) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

/**
 * Permission-based Private Route
 */
export const PermissionBasedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = true 
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredPermissions = requireAll
    ? requiredPermissions.every(permission => hasPermission(user, permission))
    : requiredPermissions.some(permission => hasPermission(user, permission));

  if (!hasRequiredPermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

/**
 * Employer-only Route
 */
export const EmployerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.userType !== 'employer' && user?.role !== 'employer') {
    return <Navigate to="/employer/register" replace />;
  }

  return children || <Outlet />;
};

/**
 * Job Seeker-only Route
 */
export const JobSeekerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.userType !== 'jobseeker' && user?.role !== 'jobseeker') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

/**
 * Admin-only Route
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(user, 'admin') && !hasRole(user, 'super_admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

/**
 * Public-only Route (for login, register pages)
 * Redirects to dashboard if already authenticated
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    // Redirect based on user role
    const redirectPath = getDefaultDashboard(user);
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

/**
 * Conditional Route - renders different components based on auth status
 */
export const ConditionalRoute = ({ 
  authenticatedComponent: AuthComponent,
  publicComponent: PublicComponent 
}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return isAuthenticated ? <AuthComponent /> : <PublicComponent />;
};

/**
 * Profile Completion Route - ensures user has completed their profile
 */
export const ProfileCompleteRoute = ({ children, requiredFields = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isProfileComplete = requiredFields.every(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], user);
    return value !== null && value !== undefined && value !== '';
  });

  if (!isProfileComplete) {
    return <Navigate to="/profile/complete" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

/**
 * Subscription Route - checks if user has active subscription
 */
export const SubscriptionRoute = ({ children, requiredPlan = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasActiveSubscription = user?.subscription?.status === 'active';
  const hasRequiredPlan = !requiredPlan || user?.subscription?.plan === requiredPlan;

  if (!hasActiveSubscription || !hasRequiredPlan) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

/**
 * Helper function to get default dashboard based on role
 */
const getDefaultDashboard = (user) => {
  if (!user) return '/';
  
  switch (user.role || user.userType) {
    case 'admin':
    case 'super_admin':
      return '/admin/dashboard';
    case 'employer':
      return '/employer/dashboard';
    case 'jobseeker':
      return '/dashboard';
    default:
      return '/';
  }
};

export default PrivateRoute;