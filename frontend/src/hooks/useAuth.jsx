// useAuth.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/auth/authThunks';
import { setToken } from '../features/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Retrieve token from localStorage
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && !token) {
      // Set token in the Redux store if it's not already set
      dispatch(setToken(storedToken));
    }
    if (storedToken && !user) {
      // Fetch user data only if token and user are present
      dispatch(fetchUserData());
    }
  }, [dispatch, token, user]);

  return { user, token, status };
};

export default useAuth;
