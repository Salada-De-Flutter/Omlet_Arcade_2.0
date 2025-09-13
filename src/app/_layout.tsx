
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configurar cor da barra de status e navegação para Android
      SystemUI.setBackgroundColorAsync('#1f2430');
    }
  }, []);
  
  return (
    <SafeAreaProvider>
      <UserProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <StatusBar style="light" backgroundColor="#1f2430" translucent={false} />
          <Slot />
        </SafeAreaView>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1f2430' 
  }
});
