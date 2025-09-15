import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PostDetail {
  id: string; title: string; bannerUrl?: string; banner_url?: string; bannerIsGif?: boolean; banner_is_gif?: boolean;
  html?: string; html_content?: string; plain?: string; plain_text?: string; createdAt?: string; created_at?: string;
  username?: string; usericon?: string; usuarios?: any;
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webHeight, setWebHeight] = useState<number>(120);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      // Ajuste da rota conforme solicitado (get-uni-post)
      const resp = await fetch(`https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/get-uni-post?id=${id}`);
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Falha ao carregar');
      setPost(json);
    } catch (e: any) {
      setError(e.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const htmlContent = post?.html || post?.html_content || null;
  const htmlWrapped = htmlContent ? `<!DOCTYPE html><html><head><meta charset=\"utf-8\" />
<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no\" />
<style>
  body { font-family: -apple-system, Roboto, 'Segoe UI', Arial; padding:8px 10px 20px; color:#e6ecf2; background:#1f2430; }
  h1,h2,h3,h4 { color:#fff; margin:0 0 12px; }
  img { max-width:100%; border-radius:8px; display:block; margin:12px 0; }
  p,li { line-height:1.45; margin:0 0 12px; }
  a { color:#ff6b58; text-decoration:none; }
  pre,code { background:#2a3138; padding:4px 6px; border-radius:4px; font-size:13px; }
  ul,ol { padding-left:20px; margin:0 0 14px; }
  table { width:100%; border-collapse:collapse; }
  iframe,video { max-width:100%; }
  body > *:first-child { margin-top:12px; }
  body > *:last-child { margin-bottom:16px; }
</style></head><body>${htmlContent}</body></html>` : null;

  const injectedJs = `(()=>{function postH(){const h=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({type:'setHeight',height:h}));}['load','resize'].forEach(e=>window.addEventListener(e,postH));const obs=new MutationObserver(postH);obs.observe(document.body,{subtree:true,childList:true,attributes:true});Array.from(document.images).forEach(im=>im.addEventListener('load',postH));postH();})();true;`;

  const onWebMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'setHeight' && typeof data.height === 'number') {
        const windowH = Dimensions.get('window').height;
        const windowW = Dimensions.get('window').width;
        // Altura do banner (aspect 16:9)
        const bannerH = windowW * 9 / 16;
        // Espaços aproximados ocupados acima/abaixo (top bar + authorRow + paddings + bottom spacing)
        const reserved = 60 /*top*/ + 70 /*author*/ + bannerH + 40 /*margins*/ + 60 /*bottom spacer*/;
        const minHeight = Math.max(160, windowH - reserved);
        setWebHeight(prev => {
          const contentHeight = data.height;
          const desired = Math.max(minHeight, contentHeight);
          const next = Math.min(desired, 6000);
          return Math.abs(next - prev) > 8 ? next : prev;
        });
      }
    } catch {}
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.topTitle}>{post?.title || 'Post'}</Text>
        <View style={{ width: 40 }} />
      </View>
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color="#ff6b58" size="large" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load} style={styles.retryBtn}><Text style={styles.retryBtnText}>Tentar novamente</Text></TouchableOpacity>
        </View>
      ) : !post ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>Post não encontrado.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retryBtn}><Text style={styles.retryBtnText}>Voltar</Text></TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.authorRow}>
            {post.usericon ? (
              <Image source={{ uri: post.usericon }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View style={{ flex:1, minWidth:0 }}>
              <Text style={styles.authorName} numberOfLines={1}>{post.username || 'Usuário'}</Text>
              <Text style={styles.meta}>{new Date(post.createdAt || post.created_at || Date.now()).toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.bannerWrap}>
            <Image source={{ uri: (post.bannerUrl || post.banner_url) }} style={styles.banner} />
            {(post.bannerIsGif || post.banner_is_gif) ? (
              <View style={styles.gifBadge}><Text style={styles.gifText}>GIF</Text></View>
            ) : null}
          </View>
          {htmlWrapped ? (
            <View style={[styles.webviewContainer, { height: webHeight, marginTop: 4 }]}>
              <WebView
                originWhitelist={["*"]}
                source={{ html: htmlWrapped }}
                style={styles.webview}
                setSupportMultipleWindows={false}
                javaScriptEnabled
                domStorageEnabled
                injectedJavaScript={injectedJs}
                onMessage={onWebMessage}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ) : (
            <Text style={[styles.plain, { marginTop: 4 }]}>{post.plain || post.plain_text}</Text>
          )}
          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#1f2430' },
  topBar: { flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingTop:12, paddingBottom:10, backgroundColor:'#1f2430' },
  backBtn: { padding:4, marginRight:6 },
  topTitle: { flex:1, color:'#fff', fontSize:16, fontWeight:'600' },
  centerWrap: { flex:1, alignItems:'center', justifyContent:'center', padding:28 },
  errorText: { color:'#ff6b58', fontSize:15, textAlign:'center', marginBottom:16 },
  loadingText: { color:'#b8bfc6', fontSize:14, marginTop:16 },
  retryBtn: { backgroundColor:'#ff6b58', paddingHorizontal:18, paddingVertical:10, borderRadius:24 },
  retryBtnText: { color:'#fff', fontWeight:'600' },
  scrollContent: { paddingBottom:40 },
  authorRow: { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingTop:8, paddingBottom:10 },
  avatar: { width:46, height:46, borderRadius:23, backgroundColor:'#2a3138', marginRight:12 },
  avatarPlaceholder: { width:46, height:46, borderRadius:23, backgroundColor:'#2a3138', marginRight:12 },
  authorName: { color:'#fff', fontSize:15, fontWeight:'600' },
  meta: { color:'#7a828b', fontSize:11, marginTop:2 },
  bannerWrap: { width:'100%', aspectRatio:16/9, backgroundColor:'#202631', position:'relative' },
  banner: { width:'100%', height:'100%', resizeMode:'cover' },
  gifBadge: { position:'absolute', top:8, left:8, backgroundColor:'rgba(0,0,0,0.55)', paddingHorizontal:8, paddingVertical:3, borderRadius:6, borderWidth:1, borderColor:'rgba(255,255,255,0.25)' },
  gifText: { color:'#ffd9cf', fontSize:11, fontWeight:'700', letterSpacing:1 },
  webviewContainer: { backgroundColor:'#1f2430', borderRadius:0, overflow:'hidden', width:'100%' },
  webview: { flex:1, backgroundColor:'transparent', width:'100%' },
  plain: { color:'#c2c9d0', fontSize:14, lineHeight:20, paddingHorizontal:16 },
});
