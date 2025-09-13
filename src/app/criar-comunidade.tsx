import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CriarComunidade() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Criar Comunidade (placeholder)</Text>
        <Text style={styles.sub}>Aqui você implementa o formulário de criação de comunidade.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f2430' },
  content: { padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sub: { color: '#b8bfc6', marginTop: 8 },
});
