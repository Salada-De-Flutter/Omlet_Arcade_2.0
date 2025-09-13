import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeWrapperProps {
  children: React.ReactNode;
  style?: object;
  excludeTop?: boolean;
  excludeBottom?: boolean;
  backgroundColor?: string;
}

export default function SafeWrapper({ 
  children, 
  style, 
  excludeTop = false, 
  excludeBottom = false,
  backgroundColor = '#1f2430'
}: SafeWrapperProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: excludeTop ? 0 : insets.top,
          paddingBottom: excludeBottom ? 0 : insets.bottom,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});