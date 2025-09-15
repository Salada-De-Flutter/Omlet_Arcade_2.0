import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PostCardProps {
  id: string;
  title: string;
  snippet?: string;
  bannerUrl: string;
  bannerIsGif?: boolean;
  createdAt: string;
  onPress?: (id: string) => void;
  // Autor
  usuarioId?: string;
  username?: string;
  usericon?: string | null;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  snippet,
  bannerUrl,
  bannerIsGif,
  createdAt,
  onPress,
  username,
  usericon
}) => {
  const dateStr = new Date(createdAt).toLocaleDateString();
  const truncated = snippet ? (snippet.length > 140 ? snippet.slice(0, 137) + '...' : snippet) : '';

  const initial = !usericon && username ? username.trim().charAt(0).toUpperCase() : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onPress && onPress(id)}
    >
      {/* Header autor */}
      <View style={styles.authorRow}>
        {usericon ? (
          <Image source={{ uri: usericon }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            {initial ? (
              <Text style={styles.avatarInitial}>{initial}</Text>
            ) : (
              <MaterialCommunityIcons name="account" size={20} color="#777f88" />
            )}
          </View>
        )}
        <View style={styles.authorTextWrap}>
          <Text style={styles.authorName} numberOfLines={1}>{username || 'Usuário'}</Text>
          <Text style={styles.metaText}>{dateStr}</Text>
        </View>
      </View>
      {/* Banner */}
      <View style={styles.bannerWrap}>
        <Image source={{ uri: bannerUrl }} style={styles.banner} />
        {bannerIsGif ? (
          <View style={styles.gifBadge}><Text style={styles.gifText}>GIF</Text></View>
        ) : null}
      </View>
      {/* Corpo */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {truncated ? <Text style={styles.snippet}>{truncated}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222832',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a3138',
    width: '100%'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.01)'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a3138',
    marginRight: 10
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a3138',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarInitial: { color: '#8ea4b5', fontSize: 16, fontWeight: '700' },
  authorTextWrap: { flex: 1, minWidth: 0 },
  authorName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  metaText: { color: '#6f7882', fontSize: 11, marginTop: 2 },
  bannerWrap: { position: 'relative', width: '100%', aspectRatio: 16/9, backgroundColor: '#1d222b' },
  banner: { width: '100%', height: '100%', resizeMode: 'cover' },
  gifBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth:1, borderColor:'rgba(255,255,255,0.25)' },
  gifText: { color: '#ffd9cf', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  body: { paddingHorizontal: 14, paddingVertical: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  snippet: { color: '#aab1b8', fontSize: 13, lineHeight: 18 },
});

export default PostCard;
