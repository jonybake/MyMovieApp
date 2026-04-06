export function getPosterUrl(path?: string | null) {
  if (!path) {
    return 'https://via.placeholder.com/300x450/1b2235/8f9bb3?text=No+Poster';
  }

  return `https://image.tmdb.org/t/p/w500${path}`;
}

export function getBackdropUrl(path?: string | null) {
  if (!path) {
    return 'https://via.placeholder.com/1280x720/111827/94a3b8?text=Movie';
  }

  return `https://image.tmdb.org/t/p/original${path}`;
}
