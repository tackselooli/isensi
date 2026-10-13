import { useEffect, useMemo } from 'react';
import axios from 'axios';
import { constConfig } from '../../const-config';

// useAxiosFetch — returns a configured axios instance pointing at the backend.
//
// Bugs fixed:
// 1. `Promis.reject` typo → `Promise.reject`.
// 2. Interceptors were registered on the global `axios` object but ejected
//    from `axiosInstance.interceptors` — they never matched. Now both the
//    register and eject use `axiosInstance.interceptors`.
// 3. Interceptors now actually attach to the instance, not the global axios.
const useAxiosFetch = () => {
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
      (config) => config,
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosFetch;
