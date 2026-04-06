import React from 'react';
import { View } from 'react-native';

type BasicProps = {
  children?: React.ReactNode;
};

function createWrapper(displayName: string) {
  const Component = React.forwardRef<View, BasicProps>(function Wrapper(
    { children },
    ref,
  ) {
    return <View ref={ref}>{children}</View>;
  });

  Component.displayName = displayName;
  return Component;
}

export const Screen = createWrapper('Screen');
export const ScreenContainer = createWrapper('ScreenContainer');
export const ScreenStack = createWrapper('ScreenStack');
export const ScreenStackHeaderConfig = createWrapper('ScreenStackHeaderConfig');
export const ScreenStackHeaderSubview = createWrapper(
  'ScreenStackHeaderSubview',
);
export const NativeScreenNavigationContainer = createWrapper(
  'NativeScreenNavigationContainer',
);
export const FullWindowOverlay = createWrapper('FullWindowOverlay');
export const SearchBar = createWrapper('SearchBar');

export function enableScreens() {}

export function enableFreeze() {}

export function screensEnabled() {
  return false;
}

export function shouldUseActivityState() {
  return false;
}

export function executeNativeBackPress() {}

export function useTransitionProgress() {
  return {
    progress: 1,
    closing: 0,
    goingForward: 1,
  };
}

export default {
  Screen,
  ScreenContainer,
  ScreenStack,
  ScreenStackHeaderConfig,
  ScreenStackHeaderSubview,
  NativeScreenNavigationContainer,
  FullWindowOverlay,
  SearchBar,
  enableScreens,
  enableFreeze,
  screensEnabled,
  shouldUseActivityState,
  executeNativeBackPress,
  useTransitionProgress,
};
