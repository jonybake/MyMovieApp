import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../tamagui.config';
import CategoryScreen from './screens/CategoryScreen';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconWrap}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: '#ff5b55',
        tabBarInactiveTintColor: '#6f7892',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="首页" />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={SearchScreen}
        options={{
          title: '发现',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="发现" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="我的" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name="dark">
        <View style={styles.container}>
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: '#111111' },
                headerTintColor: '#ffffff',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#000000' },
              }}
            >
              <RootStack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Details"
                component={DetailScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ headerShown: false }}
              />
            </RootStack.Navigator>
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
  tabBar: {
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#0e1422',
    borderTopWidth: 1,
    borderTopColor: '#192235',
  },
  tabBarItem: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tabIconText: {
    color: '#6f7892',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  tabIconTextActive: {
    color: '#ff5b55',
  },
});
