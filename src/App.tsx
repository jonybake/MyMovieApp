import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../tamagui.config';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import SearchScreen from './screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name="dark">
        <View style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: { backgroundColor: '#111' },
                headerTintColor: '#fff',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#000' },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '电影首页' }}
              />
              <Stack.Screen
                name="Details"
                component={DetailScreen}
                options={{ title: '详情' }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ title: '搜索电影' }}
              />
              <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{ headerShown: false, orientation: 'landscape' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </Theme>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
