import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";


interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Queue item type for pending requests during refresh
interface FailedQueueItem {
  resolve: () => void;
  reject: (error: AxiosError) => void;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
  withCredentials: true,
});

// Refresh control flags
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

// Process queued requests after refresh attempt finishes
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/refresh") ||
      url.includes("/refresh") ||
      url.includes("/login") || 
      url.includes("/auth/me");

    // Only attempt refresh on 401 from protected APIs
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const axiosRefreshError = refreshError as AxiosError;

        processQueue(axiosRefreshError);

        // Redirect to login/home on refresh failure
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(axiosRefreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
