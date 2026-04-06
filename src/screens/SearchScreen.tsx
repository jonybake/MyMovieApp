import { useState } from 'react';
import { ListItem, Input, YStack } from 'tamagui';
import { Play } from '@tamagui/lucide-icons';
import { movieApi } from '../api';

type MovieSearchResult = {
  id: number;
  title: string;
};

type SearchResponse = {
  results: MovieSearchResult[];
};

export default function SearchScreen() {
  const [results, setResults] = useState<MovieSearchResult[]>([]);

  const handleSearch = async (text: string) => {
    if (text.length > 2) {
      const res = await movieApi.get<SearchResponse>(
        `/search/movie?query=${text}`,
      );
      setResults(res.data.results);
      return;
    }

    setResults([]);
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Input
        placeholder="搜索电影、演员..."
        onChangeText={handleSearch}
        borderWidth={2}
      />
      <YStack marginTop="$4">
        {results.map((movie) => (
          <ListItem
            key={movie.id}
            title={movie.title}
            iconAfter={<Play size={16} />}
          />
        ))}
      </YStack>
    </YStack>
  );
}
