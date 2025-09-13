import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

type Props = {
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  onPress?: () => void;
};

export default function CommunityCard({ title, imageUrl, onPress, description }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.fallback} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description} numberOfLines={2}>{description}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_MARGIN = 16; // visual margin from screen edges

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2e3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: { width: 72, height: 72, borderRadius: 12, marginRight: 14 },
  fallback: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#23232b', marginRight: 14 },
  content: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700' },
  description: { color: '#b8bfc6', fontSize: 13, marginTop: 6 },
});
