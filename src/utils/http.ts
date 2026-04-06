import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = '/api';

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: TMDB_API_KEY,
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
          message = '未授权，请检查 API Key';
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
