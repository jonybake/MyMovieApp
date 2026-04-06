import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';

const TMDB_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTkzNGI3YmVlOWQ0MWY1YTU0ODRhMzdiMGVhZWMxZiIsIm5iZiI6MTc3NTQxNjU2Ny44MDE5OTk4LCJzdWIiOiI2OWQyYjRmNzExMzFiMTJmYzc3NzBlODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ySP8TOXyz82MjCSW8J0CyEJ7mux2NrVxk6bpOz7RLgM';

const TMDB_BASE_URL =
  Platform.OS === 'web' ? '/api' : 'https://api.themoviedb.org/3';

const http: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: TMDB_BEARER_TOKEN,
    accept: 'application/json',
  },
  params: {
    language: 'zh-CN',
  },
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (__DEV__) {
      console.log(
        `[HTTP Request] ${config.method?.toUpperCase()} -> ${config.url}`,
      );
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    let message = '网络错误，请稍后重试';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请检查 Bearer Token';
          break;
        case 404:
          message = '资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = '请求失败，请稍后重试';
      }
    }

    console.error('[HTTP Error]', message);

    return Promise.reject(new Error(message));
  },
);

export default http;
