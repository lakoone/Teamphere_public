import axios, { AxiosError } from 'axios';
const axiosServerInstance = axios.create({
  baseURL: 'http://backend:5000',
});
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STATUS === 'prod' ? process.env.NEXT_PUBLIC_DOMAIN : 'http://localhost:5000'}`,
  withCredentials: true,
});
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STATUS === 'prod' ? process.env.NEXT_PUBLIC_DOMAIN : 'http://localhost:5000'}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );
    if (response.status >= 200 && response.status < 300) {
      return true; // if token refreshed
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message === 'canceled') throw new AxiosError('canceled');
    if (typeof window !== 'undefined') {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const isTokenRefreshed = await refreshAccessToken(); // trying to get token

          if (isTokenRefreshed) {
            // if OK, return original request
            return axiosInstance(originalRequest);
          } else {
            // if fail return login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);

          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  },
);

export { axiosInstance, axiosServerInstance };
