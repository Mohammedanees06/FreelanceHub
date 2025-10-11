/**
 * Role and Permission checking utilities
 */
const ROLE_HIERARCHY = {
  super_admin: ['super_admin', 'admin', 'moderator', 'employer', 'jobseeker', 'user'],
  admin: ['admin', 'moderator', 'employer', 'jobseeker', 'user'],
  moderator: ['moderator', 'employer', 'jobseeker', 'user'],
  employer: ['employer', 'user'],
  jobseeker: ['jobseeker', 'user'],
  user: ['user']
};

// Permission definitions
const PERMISSIONS = {
  // Job permissions
  'job.create': ['employer', 'admin', 'super_admin'],
  'job.edit': ['employer', 'admin', 'super_admin'],
  'job.delete': ['employer', 'admin', 'super_admin'],
  'job.view': ['employer', 'jobseeker', 'admin', 'super_admin'],
  'job.apply': ['jobseeker'],
  
  // Application permissions
  'application.view': ['employer', 'jobseeker', 'admin', 'super_admin'],
  'application.manage': ['employer', 'admin', 'super_admin'],
  'application.submit': ['jobseeker'],
  
  // Profile permissions
  'profile.edit.own': ['employer', 'jobseeker', 'admin', 'super_admin'],
  'profile.edit.any': ['admin', 'super_admin'],
  'profile.view.any': ['admin', 'super_admin'],
  
  // Admin permissions
  'admin.access': ['admin', 'super_admin'],
  'admin.users.manage': ['admin', 'super_admin'],
  'admin.jobs.manage': ['admin', 'super_admin', 'moderator'],
  'admin.reports.view': ['admin', 'super_admin', 'moderator'],
  'admin.settings.manage': ['super_admin'],
  
  // Chat permissions
  'chat.send': ['employer', 'jobseeker', 'admin', 'super_admin'],
  'chat.receive': ['employer', 'jobseeker', 'admin', 'super_admin'],
  
  // Company permissions
  'company.create': ['employer', 'admin', 'super_admin'],
  'company.edit.own': ['employer'],
  'company.edit.any': ['admin', 'super_admin'],
  'company.verify': ['admin', 'super_admin']
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user, role) => {
  if (!user || !role) return false;
  
  const userRole = user.role || user.userType;
  if (!userRole) return false;
  
  // Check if user's role includes the required role in its hierarchy
  return ROLE_HIERARCHY[userRole]?.includes(role) || false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles = []) => {
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user has all specified roles
 */
export const hasAllRoles = (user, roles = []) => {
  return roles.every(role => hasRole(user, role));
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !permission) return false;
  
  const userRole = user.role || user.userType;
  if (!userRole) return false;
  
  // Check if permission exists and if user's role is in the allowed roles
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user, permissions = []) => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all specified permissions
 */
export const hasAllPermissions = (user, permissions = []) => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (user, route) => {
  const routePermissions = {
    '/admin': ['admin.access'],
    '/admin/users': ['admin.users.manage'],
    '/admin/jobs': ['admin.jobs.manage'],
    '/admin/reports': ['admin.reports.view'],
    '/admin/settings': ['admin.settings.manage'],
    '/employer/jobs/create': ['job.create'],
    '/employer/applications': ['application.manage'],
    '/jobs/apply': ['job.apply'],
    '/profile/edit': ['profile.edit.own'],
    '/messages': ['chat.send', 'chat.receive']
  };
  
  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // No permissions required for this route
  
  return hasAnyPermission(user, requiredPermissions);
};

/**
 * Check if user is the owner of a resource
 */
export const isOwner = (user, resource) => {
  if (!user || !resource) return false;
  
  return (
    user.id === resource.userId ||
    user.id === resource.ownerId ||
    user.id === resource.createdBy ||
    user.id === resource.employerId
  );
};

/**
 * Check if user can edit a resource
 */
export const canEdit = (user, resource) => {
  if (!user || !resource) return false;
  
  // Super admin can edit anything
  if (hasRole(user, 'super_admin')) return true;
  
  // Admin can edit most things
  if (hasRole(user, 'admin')) {
    // Check if it's not a super admin's resource
    return resource.userRole !== 'super_admin';
  }
  
  // Check if user is the owner
  return isOwner(user, resource);
};

/**
 * Check if user can delete a resource
 */
export const canDelete = (user, resource) => {
  if (!user || !resource) return false;
  
  // Similar to canEdit but might have different rules
  if (hasRole(user, 'super_admin')) return true;
  
  if (hasRole(user, 'admin')) {
    return resource.userRole !== 'super_admin';
  }
  
  // Regular users can only delete their own resources
  return isOwner(user, resource);
};

/**
 * Check if user can view a resource
 */
export const canView = (user, resource, resourceType) => {
  if (!user || !resource) return false;
  
  // Admins can view everything
  if (hasRole(user, 'admin') || hasRole(user, 'super_admin')) return true;
  
  switch (resourceType) {
    case 'job':
      // Everyone can view published jobs
      return resource.status === 'published' || isOwner(user, resource);
    
    case 'application':
      // Job seekers can view their own applications
      // Employers can view applications for their jobs
      return (
        isOwner(user, resource) ||
        user.id === resource.jobOwnerId
      );
    
    case 'profile':
      // Users can view their own profile
      // Employers can view job seeker profiles (if public)
      return (
        isOwner(user, resource) ||
        (hasRole(user, 'employer') && resource.isPublic)
      );
    
    case 'company':
      // Anyone can view verified companies
      // Owners can view their own companies
      return resource.isVerified || isOwner(user, resource);
    
    default:
      return false;
  }
};

/**
 * Get user's role label
 */
export const getRoleLabel = (user) => {
  const roleLabels = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    moderator: 'Moderator',
    employer: 'Employer',
    jobseeker: 'Job Seeker',
    user: 'User',
    client: 'Client', // Alias for employer
    freelancer: 'Freelancer' // Alias for jobseeker
  };
  
  const userRole = user?.role || user?.userType;
  return roleLabels[userRole] || 'User';
};

/**
 * Check if user's account is active
 */
export const isAccountActive = (user) => {
  if (!user) return false;
  
  return (
    user.status === 'active' &&
    !user.isBanned &&
    !user.isSuspended &&
    user.emailVerified
  );
};

/**
 * Check if user has completed profile
 */
export const hasCompleteProfile = (user, requiredFields = []) => {
  if (!user) return false;
  
  const defaultRequiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone'
  ];
  
  const fieldsToCheck = requiredFields.length > 0 ? requiredFields : defaultRequiredFields;
  
  return fieldsToCheck.every(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], user);
    return value !== null && value !== undefined && value !== '';
  });
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = (user, planType = null) => {
  if (!user?.subscription) return false;
  
  const isActive = user.subscription.status === 'active' && 
                  new Date(user.subscription.expiresAt) > new Date();
  
  if (planType) {
    return isActive && user.subscription.plan === planType;
  }
  
  return isActive;
};

/**
 * Get user's permissions list
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  
  const userRole = user.role || user.userType;
  if (!userRole) return [];
  
  return Object.entries(PERMISSIONS)
    .filter(([permission, roles]) => roles.includes(userRole))
    .map(([permission]) => permission);
};

/**
 * Check feature access based on subscription
 */
export const canAccessFeature = (user, feature) => {
  const featureRequirements = {
    'unlimited_applications': ['premium', 'enterprise'],
    'priority_support': ['premium', 'enterprise'],
    'advanced_analytics': ['enterprise'],
    'bulk_job_posting': ['enterprise'],
    'api_access': ['enterprise'],
    'custom_branding': ['enterprise']
  };
  
  const requiredPlans = featureRequirements[feature];
  if (!requiredPlans) return true; // Feature doesn't require subscription
  
  return hasActiveSubscription(user) && 
         requiredPlans.includes(user.subscription?.plan);
};

/**
 * Helper function: Check if user is a freelancer (jobseeker)
 */
export const isFreelancer = (user) => {
  if (!user) return false;
  const userRole = user.role || user.userType;
  return userRole === 'jobseeker' || userRole === 'freelancer';
};

/**
 * Helper function: Check if user is a client (employer)
 */
export const isClient = (user) => {
  if (!user) return false;
  const userRole = user.role || user.userType;
  return userRole === 'employer' || userRole === 'client';
};

/**
 * Helper function: Check if user is an admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  const userRole = user.role || user.userType;
  return userRole === 'admin' || userRole === 'super_admin';
};

/**
 * Helper function: Check if user is a jobseeker
 */
export const isJobSeeker = (user) => {
  return isFreelancer(user);
};

/**
 * Helper function: Check if user is an employer
 */
export const isEmployer = (user) => {
  return isClient(user);
};

export default {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  isOwner,
  canEdit,
  canDelete,
  canView,
  getRoleLabel,
  isAccountActive,
  hasCompleteProfile,
  hasActiveSubscription,
  getUserPermissions,
  canAccessFeature,
  isFreelancer,
  isClient,
  isAdmin,
  isJobSeeker,
  isEmployer
};