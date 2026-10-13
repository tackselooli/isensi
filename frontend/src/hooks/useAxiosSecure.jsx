import { useEffect, useMemo } from 'react';
import axios from 'axios';
import { constConfig } from '../../const-config';

// useAxiosSecure — returns a configured axios instance that automatically
// attaches the JWT Bearer token from localStorage to every request.
//
// Previously this file was an empty placeholder that returned JSX — it would
// have crashed any caller that tried to use it as an axios instance.
const useAxiosSecure = () => {
  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: constConfig.baseUrl,
        withCredentials: true,
      }),
    [],
  );

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Auto-logout on 401 Unauthorized.
        if (error.response && error.response.status === 401) {
          // Optional: clear token, but let auth slice handle the state.
          // localStorage.removeItem('token');
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosSecure;
