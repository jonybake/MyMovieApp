import axios from 'axios';
import { Platform } from 'react-native';

const TMDB_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTkzNGI3YmVlOWQ0MWY1YTU0ODRhMzdiMGVhZWMxZiIsIm5iZiI6MTc3NTQxNjU2Ny44MDE5OTk4LCJzdWIiOiI2OWQyYjRmNzExMzFiMTJmYzc3NzBlODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ySP8TOXyz82MjCSW8J0CyEJ7mux2NrVxk6bpOz7RLgM';

const TMDB_BASE_URL =
  Platform.OS === 'web' ? '/api' : 'https://api.themoviedb.org/3';

export type PopularMovie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  popularity?: number;
  vote_average: number;
  release_date?: string;
};

type PopularResponse = {
  results: PopularMovie[];
};

export type MovieGenre = {
  id: number;
  name: string;
};

export type GenreMovie = PopularMovie;

export type MovieCast = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  popularity?: number;
  release_date?: string;
  genres: MovieGenre[];
  credits?: {
    cast: MovieCast[];
  };
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
};

type MovieGenreResponse = {
  genres: MovieGenre[];
};

type MovieDetailResponse = MovieDetail;

type MovieVideoResponse = {
  results: MovieVideo[];
};

export const movieApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: TMDB_BEARER_TOKEN,
    accept: 'application/json',
  },
  params: {
    language: 'zh-CN',
  },
});

export async function loadPopularMovies(page = 1) {
  const response = await movieApi.get<PopularResponse>('/movie/popular', {
    params: {
      page,
    },
  });

  return response.data.results ?? [];
}

export async function loadMovieGenres() {
  const response = await movieApi.get<MovieGenreResponse>('/genre/movie/list');

  return response.data.genres ?? [];
}

export async function loadMoviesByGenre(genreId: number, page = 1) {
  const response = await movieApi.get<PopularResponse>('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
    },
  });

  return response.data.results ?? [];
}

export async function loadMovieDetail(movieId: number) {
  const response = await movieApi.get<MovieDetailResponse>(`/movie/${movieId}`, {
    params: {
      append_to_response: 'credits',
    },
  });

  return response.data;
}

export async function loadMovieVideos(movieId: number) {
  const response = await movieApi.get<MovieVideoResponse>(`/movie/${movieId}/videos`, {
    params: {
      language: 'en-US',
    },
  });

  return response.data.results ?? [];
}
