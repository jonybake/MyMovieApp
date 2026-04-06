import axios from 'axios';
export const movieApi = axios.create({
  baseURL: '/api',
  params: {
    api_key: 'c9934b7bee9d41f5a5484a37b0eaec1f',
    language: 'zh-CN',
  },
});
