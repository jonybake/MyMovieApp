import { Card, H2, Image, ScrollView, Text, XStack, YStack } from 'tamagui';

type NavigationLike = {
  navigate: (screen: string) => void;
};

type HomeScreenProps = {
  navigation: NavigationLike;
};

type CategorySectionProps = {
  title: string;
  navigation: NavigationLike;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Card height={200} borderRadius="$4" overflow="hidden">
          <Image
            source={{
              uri: 'https://image.tmdb.org/t/p/original/backdrop_url.jpg',
            }}
            width="100%"
            height="100%"
          />
          <Card.Footer padding="$3" backgroundColor="rgba(0,0,0,0.5)">
            <H2 color="white" size="$6">
              热门: 星际穿越
            </H2>
          </Card.Footer>
        </Card>

        <CategorySection title="动作电影" navigation={navigation} />
        <CategorySection title="科幻经典" navigation={navigation} />
      </YStack>
    </ScrollView>
  );
}

function CategorySection({ title, navigation }: CategorySectionProps) {
  return (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="bold" color="$color">
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$3">
          {[1, 2, 3].map(item => (
            <YStack
              key={item}
              width={120}
              onPress={() => navigation.navigate('Details')}
            >
              <Image
                source={{ uri: 'https://image.tmdb.org/t/p/w500/poster.jpg' }}
                width={120}
                height={180}
                borderRadius={8}
              />
              <Text numberOfLines={1} marginTop={1}>
                电影名称
              </Text>
            </YStack>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
