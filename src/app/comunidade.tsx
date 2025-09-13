import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ComunidadeDetail() {
  const params = useLocalSearchParams();
  const rawTitle = (params.title as string) ?? 'Comunidade';
  const rawImage = (params.imageUrl as string) ?? null;
  const rawBanner = (params.banner as string) ?? null;
  const rawDescricao = (params.descricao as string) ?? null;
  const title = decodeURIComponent(rawTitle);
  const imageUrl = rawImage ? decodeURIComponent(rawImage) : null;
  const bannerUrl = rawBanner ? decodeURIComponent(rawBanner) : null;
  const descricao = rawDescricao ? decodeURIComponent(rawDescricao) : null;

  const router = useRouter();
  const bannerHeight = Math.max(110, Math.round(width * 0.34));
  const [activeTab, setActiveTab] = useState<'BIO' | 'POSTS' | 'CANAIS'>('POSTS');
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

  <View style={styles.headerPlain}>
        {bannerUrl ? (
          <ImageBackground
            source={{ uri: bannerUrl }}
            style={[styles.bannerImage, { height: bannerHeight }]}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <View style={[styles.bannerOverlay, { height: bannerHeight }]} />

            {/* avatar + title overlay at bottom of banner */}
            <View style={[styles.headerContentPlainAbsolute, { bottom: 8 }]} pointerEvents="box-none">
              <View style={{ marginRight: 12 }}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.headerContentPlain}>
            <View style={styles.avatarWrap}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback} />
              )}
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.tabs}>
        {(['BIO', 'POSTS', 'CANAIS'] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === t ? styles.tabTextActive : undefined]}>{t}</Text>
            {activeTab === t ? <View style={styles.tabUnderline} /> : <View style={{ height: 4 }} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        {activeTab === 'BIO' ? (
          <View>
            {descricao ? (
              <Text style={styles.infoText}>{descricao}</Text>
            ) : (
              <Text style={styles.infoText}>Sem descrição disponível.</Text>
            )}
          </View>
        ) : (
          <Text style={styles.infoText}>Aqui você verá a {activeTab.toLowerCase()} da comunidade.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f2430' },
  header: { height: Math.round(height * 0.36), backgroundColor: '#222', justifyContent: 'flex-end' },
  headerContentPlain: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 18 },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 72, height: 72, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)' },
  avatarFallback: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#2a2e3a' },
  titleBlock: { flex: 1 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },

  tabs: { flexDirection: 'row', backgroundColor: '#2a2e3a', paddingHorizontal: 12 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { color: '#9aa0a8', fontWeight: '700' },
  tabTextActive: { color: '#ff6b58' },
  tabUnderline: { marginTop: 6, height: 2, width: 36, backgroundColor: '#ff6b58', borderRadius: 2 },

  body: { flex: 1, padding: 16 },
  infoText: { color: '#b8bfc6', fontSize: 16 },
  headerPlain: { backgroundColor: '#222', overflow: 'hidden' },
  bannerImage: { width: '100%', aspectRatio: 16 / 7 },
  headerContentPlainAbsolute: { position: 'absolute', left: 0, right: 0, top: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  avatarWrapAbsolute: { marginRight: 12, marginLeft: 8 },
  titleBlockAbsolute: { flex: 1 },
  bannerOverlay: { position: 'absolute', left: 0, right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.28)' },
});
