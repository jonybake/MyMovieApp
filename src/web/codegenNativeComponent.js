import React from 'react';
import { StyleSheet } from 'react-native';

export default function codegenNativeComponent() {
  return React.forwardRef(function NativeComponentStub(props, ref) {
    const { onInsetsChange, onLayout, style, children, ...restProps } = props;

    return React.createElement(
      'div',
      { ...restProps, ref, style: StyleSheet.flatten(style) },
      children,
    );
  });
}
