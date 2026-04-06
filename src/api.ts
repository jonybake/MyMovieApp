import axios from 'axios';

const TMDB_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTkzNGI3YmVlOWQ0MWY1YTU0ODRhMzdiMGVhZWMxZiIsIm5iZiI6MTc3NTQxNjU2Ny44MDE5OTk4LCJzdWIiOiI2OWQyYjRmNzExMzFiMTJmYzc3NzBlODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ySP8TOXyz82MjCSW8J0CyEJ7mux2NrVxk6bpOz7RLgM';

export type PopularMovie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
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

type MovieGenreResponse = {
  genres: MovieGenre[];
};

export const movieApi = axios.create({
  baseURL: '/api',
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
