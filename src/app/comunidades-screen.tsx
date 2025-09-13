import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomBar from '../components/BottomBar';
import CommunityCard from '../components/CommunityCard';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function ComunidadesScreen() {
  const drawerRef = React.useRef<DrawerLayoutAndroid | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const [comunidades, setComunidades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const openDrawer = () => {
    try {
      (drawerRef.current as any)?.openDrawer();
    } catch {
      // noop
    }
  };

  const renderDrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeaderWrap}>
        {user?.usericon ? (
          <Image source={{ uri: user.usericon }} style={styles.drawerAvatarImage} />
        ) : (
          <View style={styles.drawerAvatar} />
        )}
        <View style={styles.drawerHeaderText}>
          <Text style={styles.drawerName}>{user?.username ?? 'Visitante'}</Text>
          {!user ? <Text style={styles.drawerSub}>(pressione para logar)</Text> : null}
        </View>
      </View>
      <View style={styles.drawerList}>
        <TouchableOpacity style={styles.drawerItem} activeOpacity={0.75}>
          <MaterialCommunityIcons name="account-outline" size={20} color="#f1f3f5" style={{ width: 28 }} />
          <Text style={styles.drawerItemText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} activeOpacity={0.75}>
          <MaterialCommunityIcons name="trophy-outline" size={20} color="#f1f3f5" style={{ width: 28 }} />
          <Text style={styles.drawerItemText}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} activeOpacity={0.75}>
          <MaterialCommunityIcons name="account-group-outline" size={20} color="#f1f3f5" style={{ width: 28 }} />
          <Text style={styles.drawerItemText}>Comunidades</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // fetch function usable for initial load, pagination and refresh
  const fetchComunidades = async (params?: { page?: number; append?: boolean }) => {
    const p = params?.page ?? 1;
    const append = params?.append ?? false;
    if (!append) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(`https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/get-comunidades?page=${p}&pageSize=10`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      setComunidades((prev) => {
        if (append) {
          // append and dedupe by id
          const ids = new Set(prev.map((i) => i.id));
          const merged = prev.concat(list.filter((i) => !ids.has(i.id)));
          return merged;
        }
        return list;
      });

      setHasMore(list.length === 10); // if returned less than pageSize, no more
      setPage(p);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchComunidades({ page: 1, append: false });
    return () => { mounted = false; };
  }, []);

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={260}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
    >
      <View style={styles.container}> 
        <StatusBar style="light" />
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
            <MaterialCommunityIcons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#8b8f96" style={{ marginRight: 8 }} />
            <TextInput placeholder="Pesquisar" placeholderTextColor="#8b8f96" style={styles.searchInput} />
          </View>
          <View style={styles.topIcons}>
            <MaterialCommunityIcons name="storefront-outline" size={22} color="#fff" style={styles.icon} />
            <View style={styles.iconWithBadge}>
              <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
            </View>
            <MaterialCommunityIcons name="account-multiple-outline" size={22} color="#fff" style={styles.icon} />
          </View>
        </View>
        {/* Content */}
        <View style={styles.body}>
          {loading && comunidades.length === 0 ? (
            <View style={{ paddingTop: 12 }}>
              <ActivityIndicator size="large" color="#ff6b58" />
            </View>
          ) : error && comunidades.length === 0 ? (
            <View style={{ paddingTop: 12 }}>
              <Text style={{ color: '#ff6b58', textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={comunidades}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, paddingHorizontal: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ width: '100%' }}>
                  <CommunityCard
                    title={item.title ?? item.name}
                    imageUrl={item.imageUrl ?? item.icon ?? null}
                    onPress={() => {
                      const title = (item.title ?? item.name) as string;
                      const imageUrl = (item.imageUrl ?? item.icon ?? '') as string;
                      const banner = (item.banner ?? '') as string;
                      const descricao = (item.description ?? item.descricao ?? '') as string;
                      router.push({
                        pathname: '/comunidade',
                        params: {
                          title: encodeURIComponent(title),
                          imageUrl: encodeURIComponent(imageUrl),
                          banner: encodeURIComponent(banner),
                          descricao: encodeURIComponent(descricao),
                        }
                      });
                    }}
                  />
                </View>
              )}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (hasMore && !loadingMore && !loading) {
                  fetchComunidades({ page: page + 1, append: true });
                }
              }}
              ListFooterComponent={() =>
                loadingMore ? (
                  <View style={{ paddingVertical: 12 }}>
                    <ActivityIndicator size="small" color="#ff6b58" />
                  </View>
                ) : null
              }
              ListEmptyComponent={() => (
                <View style={{ width: '100%' }}>
                  <Text style={styles.infoText}>Nenhuma comunidade encontrada.</Text>
                </View>
              )}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setHasMore(true);
                fetchComunidades({ page: 1, append: false });
              }}
            />
          )}
        </View>
        {/* Bottom bar */}
        <BottomBar active="communities" />
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f2430' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#1f2430',
  },
  menuBtn: { padding: 6, marginRight: 6 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282832',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    marginRight: 10,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: 8 },
  iconWithBadge: { marginLeft: 8, position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -8, backgroundColor: '#ff6b58', borderRadius: 8, paddingHorizontal: 4, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  // align items to the top and stretch children so the card sits under the top bar
  // keep zero horizontal padding here to avoid clipping wide cards; FlatList will provide padding
  body: { flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', paddingHorizontal: 0 },
  infoText: { color: '#b8bfc6', textAlign: 'center', fontSize: 16, lineHeight: 22 },
  bottomBar: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2a2f3a',
    backgroundColor: '#1f2430',
    paddingHorizontal: 6,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    minHeight: 56,
  },
  footerText: { color: '#8b8f96', fontSize: 11, marginTop: 4 },
  centerButtonWrap: {},
  centerButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ff6b58', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  centerButtonSmall: {},
  centerButtonIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff6b58',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 2,
  },
  drawerContainer: { flex: 1, backgroundColor: '#1f2430' },
  drawerHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
    backgroundColor: '#1f2430',
  },
  drawerAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2a2f3a', marginRight: 12 },
  drawerAvatarImage: { width: 72, height: 72, borderRadius: 36, marginRight: 12 },
  drawerHeaderText: { flex: 1 },
  drawerName: { color: '#fff', fontSize: 20, fontWeight: '700' },
  drawerSub: { color: '#9aa0a8', marginTop: 6 },
  drawerList: { paddingHorizontal: 12, marginTop: 6 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1b1c1e' },
  drawerItemText: { color: '#f1f3f5', marginLeft: 8, fontSize: 16 },
  drawerFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#202125' },
  drawerFooterTitle: { color: '#fff', fontWeight: '700' },
  drawerFooterSub: { color: '#9aa0a8', marginTop: 6 },
});
