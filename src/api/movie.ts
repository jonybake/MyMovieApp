import http from '../utils/http';

// 定义电影对象接口
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

// 电影相关 API
export const MovieService = {
  // 获取热门电影
  getPopular: (page = 1): Promise<{ results: Movie[] }> =>
    http.get('/movie/popular', { params: { page } }),

  // 获取电影详情
  getDetails: (movieId: number): Promise<Movie> =>
    http.get(`/movie/${movieId}`),

  // 搜索电影
  search: (query: string): Promise<{ results: Movie[] }> =>
    http.get('/search/movie', { params: { query } }),

  // 辅助函数：拼接图片全路径
  getImage: (path: string, size: 'w500' | 'original' = 'w500') =>
    path
      ? `https://image.tmdb.org/t/p/${size}${path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
};
