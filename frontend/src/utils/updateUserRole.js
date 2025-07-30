// Utility to update user role in localStorage
export const updateUserRole = (role) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      user.role = role;
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Updated user role in localStorage:', user);
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }
  return false;
};

// Check if current user has admin role
export const checkAdminRole = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('Current user in localStorage:', user);
      return user.role === 'admin';
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
  return false;
}; 