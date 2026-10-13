// utils/authUtils.js

export const fetchUser = async () => {
    try {
      const response = await fetch('/api/verify-token', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        console.error('Failed to fetch user:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };
  