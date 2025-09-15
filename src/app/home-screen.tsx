import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import BottomBar from '../components/BottomBar';
import PostCard from '../components/PostCard';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const drawerRef = React.useRef<DrawerLayoutAndroid | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = useCallback(async (opts: { silent?: boolean; refresh?: boolean; nextPage?: number; append?: boolean } = {}) => {
    const targetPage = opts.nextPage ?? 1;
    const isRefresh = opts.refresh || targetPage === 1;
    if (isRefresh) {
      setPage(1);
      setHasMore(true);
    }
    if (opts.append) {
      setLoadingMore(true);
    } else if (!opts.silent && !isRefresh) {
      setLoading(true);
    } else if (isRefresh && !opts.silent) {
      setLoading(true);
    }
    if (opts.refresh) setRefreshing(true);
    setError(null);
    try {
      const url = `https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/get-postagem?page=${targetPage}&pageSize=10`;
      const resp = await fetch(url);
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Erro ao carregar');
      const arr = Array.isArray(json) ? json : (json.items || []);
      const totalPages = Array.isArray(json) ? (arr.length < 10 ? 1 : targetPage + 1) : json.totalPages;
      setHasMore(targetPage < totalPages && arr.length > 0);
      setPage(targetPage);
      setPosts(prev => (opts.append ? [...prev, ...arr] : arr));
    } catch (e: any) {
      setError(e.message || 'Falha ao carregar');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const loadMore = () => {
    if (loadingMore || loading || refreshing) return;
    if (!hasMore) return;
    fetchFeed({ nextPage: page + 1, append: true, silent: true });
  };

  const onRefresh = () => fetchFeed({ refresh: true, silent: true, nextPage: 1 });

  const renderPostItem = ({ item }: { item: any }) => (
    <PostCard
      id={item.id}
      title={item.title}
      snippet={item.snippet || item.plain_text}
      bannerUrl={item.bannerUrl || item.banner_url}
      bannerIsGif={item.bannerIsGif || item.banner_is_gif}
      createdAt={item.createdAt || item.created_at}
      username={item.username || item.user_name}
      usericon={item.usericon || item.user_icon}
      onPress={() => {
        router.push({ pathname: '/post/[id]', params: { id: item.id } });
      }}
    />
  );

  const openDrawer = () => {
    try {
      (drawerRef.current as any)?.openDrawer();
    } catch {
      // noop
    }
  };

  // Drawer simplificado, igual ao print, só com avatar, nome e 3 opções
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
          {loading && posts.length === 0 ? (
            <View style={styles.centerState}> 
              <ActivityIndicator color="#ff6b58" size="large" />
              <Text style={styles.stateText}>Carregando posts...</Text>
            </View>
          ) : error && posts.length === 0 ? (
            <View style={styles.centerState}>
              <Text style={styles.stateTextError}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => fetchFeed()}> 
                <Text style={styles.retryBtnText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.centerState}>
              <View style={styles.shapesRow}>
                <MaterialCommunityIcons name="triangle-outline" size={20} color="#7b7f86" style={styles.shapeIcon} />
                <MaterialCommunityIcons name="square-outline" size={20} color="#7b7f86" style={styles.shapeIcon} />
                <MaterialCommunityIcons name="circle-outline" size={20} color="#7b7f86" style={styles.shapeIcon} />
                <MaterialCommunityIcons name="close" size={20} color="#7b7f86" style={styles.shapeIcon} />
              </View>
              <Text style={styles.infoText}>Você está atualizado nas postagens.</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={renderPostItem}
              contentContainerStyle={styles.feedListContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff6b58" />}
              ListFooterComponent={
                (loadingMore || (loading && posts.length>0)) ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} color="#ff6b58" />
                ) : error && posts.length>0 ? (
                  <View style={{ paddingVertical: 20 }}>
                    <Text style={{ color:'#ff6b58', textAlign:'center', marginBottom:8, fontSize:12 }}>Erro ao carregar mais: {error}</Text>
                    <TouchableOpacity onPress={() => fetchFeed({ nextPage: page+1, append:true, silent:true })} style={{ alignSelf:'center', paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:'#ff6b58' }}>
                      <Text style={{ color:'#fff', fontSize:12, fontWeight:'600' }}>Tentar novamente</Text>
                    </TouchableOpacity>
                  </View>
                ) : !hasMore ? (
                  <View style={{ paddingVertical: 24 }}><Text style={{ color:'#58606a', textAlign:'center', fontSize:12 }}>Fim do feed</Text></View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.4}
              onEndReached={loadMore}
            />
          )}
        </View>
        {/* Bottom bar */}
        <BottomBar active="home" />
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
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 0, alignSelf: 'stretch', width: '100%' },
  shapesRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'center' },
  shapeIcon: { marginHorizontal: 10 },
  infoText: { color: '#b8bfc6', textAlign: 'center', fontSize: 16, lineHeight: 22 },
  highlight: { color: '#ff6b58', fontWeight: '700' },
  centerState: { flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:28 },
  stateText: { marginTop:16, color:'#b8bfc6', fontSize:15 },
  stateTextError: { color:'#ff6b58', fontSize:15, textAlign:'center', marginBottom:16 },
  retryBtn: { backgroundColor:'#ff6b58', paddingHorizontal:18, paddingVertical:10, borderRadius:22 },
  retryBtnText: { color:'#fff', fontWeight:'600', fontSize:14 },
  feedListContent: { paddingHorizontal:16, paddingTop:8, paddingBottom:90 },
  /* post card styles moved to PostCard component */
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