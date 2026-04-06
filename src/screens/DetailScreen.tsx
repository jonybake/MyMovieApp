import { Button, Image, Paragraph, Text, XStack, YStack } from 'tamagui';
import { Star } from '@tamagui/lucide-icons';

type NavigationLike = {
  navigate: (screen: string) => void;
};

type DetailScreenProps = {
  navigation: NavigationLike;
};

export default function DetailScreen({ navigation }: DetailScreenProps) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Image
        source={{ uri: 'https://image.tmdb.org/t/p/original/backdrop_url.jpg' }}
        width="100%"
        height={300}
      />
      <YStack padding="$4" gap="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$8" fontWeight="bold">
            奥本海默
          </Text>
          <XStack alignItems="center" gap="$1">
            <Star color="yellow" size={18} />
            <Text>8.9</Text>
          </XStack>
        </XStack>

        <Paragraph size="$4" theme="alt1">
          剧情简介：这是一部围绕原子弹之父奥本海默展开的人物传记电影。
        </Paragraph>

        <Button theme="active" onPress={() => navigation.navigate('Player')}>
          立即播放
        </Button>
      </YStack>
    </YStack>
  );
}
