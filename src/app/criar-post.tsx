import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image, Keyboard, LayoutAnimation, Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useUser } from '../context/UserContext';

export default function CriarPost() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGifBanner, setIsGifBanner] = useState(false);
  const TITLE_LIMIT = 80;
  const CONTENT_LIMIT = 1000;
  const [uploadingInline, setUploadingInline] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const webViewRef = useRef<WebView | null>(null);
  const pendingAlignRef = useRef<string | null>(null);

  // HTML base injetado no WebView com Quill
  const quillHtml = `<!DOCTYPE html><html><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html,body { background:transparent; color:#fff; margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
    .ql-container { font-size:17px !important; border:none !important; background:transparent !important; }
    .ql-toolbar { display:none !important; }
    .ql-editor { min-height:300px; padding:0 0 80px 0; outline:none; }
    .ql-editor p { line-height:1.55; margin:0 0 14px; }
    .ql-editor p:last-child { margin-bottom:0; }
    .ql-editor::-webkit-scrollbar { width:0; height:0; }
    img { max-width:100%; border-radius:8px; margin:8px 0; }
    ::-webkit-scrollbar { width:0; height:0; }
  </style>
  <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet" />
  </head><body>
    <div id="editor"></div>
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    <script>
      const editor = new Quill('#editor', { theme: 'snow', modules: { toolbar: false } });
      function sendUpdate(){
        const html = editor.root.innerHTML;
        const text = editor.getText();
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'CONTENT', html, text}));
      }
      editor.on('text-change', sendUpdate);
      document.addEventListener('message', onMsg);
      window.addEventListener('message', onMsg);
      function onMsg(e){
        let data; try { data = JSON.parse(e.data); } catch(_) { return; }
        if(data.type==='SET_ALIGN'){
          const value = data.value; // left|center|right|justify
          const range = editor.getSelection();
          if(range){
            // aplica por parágrafo
            if(range.length === 0){
              editor.format('align', value==='left'?false:value);
            } else {
              const end = range.index + range.length;
              let index = range.index;
              while(index < end){
                editor.formatLine(index, 1, 'align', value==='left'?false:value);
                index++;
              }
            }
          }
          sendUpdate();
        } else if(data.type==='INSERT_IMAGE'){
          const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
            editor.insertEmbed(range.index, 'image', data.url, Quill.sources.USER);
            editor.setSelection(range.index + 1, 0);
            sendUpdate();
        } else if(data.type==='FOCUS'){
          setTimeout(()=>{ editor.focus(); }, 0);
        }
      }
      // Força envio inicial
      sendUpdate();
    </script>
  </body></html>`;

  const postToQuill = (msg: any) => {
    webViewRef.current?.postMessage(JSON.stringify(msg));
  };

  const cycleAlignment = useCallback(() => {
    // Não sabemos última seleção aqui; WebView mantém
    const order: Record<string,string> = { left:'center', center:'right', right:'justify', justify:'left' };
    // heurística: armazenar último escolhido em ref
    const current = pendingAlignRef.current || 'left';
    const next = order[current];
    pendingAlignRef.current = next;
    postToQuill({ type:'SET_ALIGN', value: next });
  }, []);

  // Listener teclado (mantido)

  useEffect(() => {
    let lastHeight = 0;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e: any) => {
      const raw = e.endCoordinates?.height || 0;
      // Evita valores irreais (às vezes duplicados ou inflados)
      const h = Math.min(Math.max(raw, 0), 600);
      if (Math.abs(h - lastHeight) < 8) return; // ignora variações mínimas / duplicadas
      lastHeight = h;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(h);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      if (lastHeight === 0) return;
      lastHeight = 0;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const uploadBannerIfNeeded = async (): Promise<string> => {
    // Se já for uma URL http(s), reutiliza.
    if (!selectedImage) throw new Error('Sem banner');
    if (/^https?:\/\//i.test(selectedImage)) return selectedImage;
    // Upload para ImgBB (similar ao inline) - poderia unificar depois.
    const apiKey = '403f04793c78d56e5458d53f3c240b4e';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'banner.jpg'
    } as any);
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (!data.success) throw new Error('Falha upload banner');
    return data.data.url as string;
  };

  const handlePublish = async () => {
    if (publishing) return;
    if (!selectedImage) { Alert.alert('Erro', 'Selecione um banner'); return; }
    if (!title.trim()) { Alert.alert('Erro', 'Título obrigatório'); return; }
    if (!(plainText.trim().length > 0 || /<img/i.test(htmlContent))) {
      Alert.alert('Erro', 'Adicione conteúdo ou imagem inline');
      return;
    }
    try {
      setPublishing(true);
      const bannerUrl = await uploadBannerIfNeeded();
      const body = {
        usuario_id: user?.id, // sem auth, função usa usuario_id do body
        title: title.trim(),
        banner_url: bannerUrl,
        banner_is_gif: isGifBanner,
        html_content: htmlContent,
        plain_text: plainText.trim()
      };
      const resp = await fetch('https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/post-postagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || 'Falha ao publicar');
      }
      Alert.alert('Sucesso', 'Post publicado!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro desconhecido');
    } finally {
      setPublishing(false);
    }
  };
  const uploadImageToImgBB = async (imageUri: string) => {
    const apiKey = '403f04793c78d56e5458d53f3c240b4e';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'inline.jpg',
    } as any);
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (!data.success) throw new Error('Upload falhou');
    return data.data.url as string;
  };

  const handleInsertInlineImage = async () => {
    if (uploadingInline) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) { Alert.alert('Permissão negada', 'Acesse a galeria para inserir imagem.'); return; }
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing:false, quality:0.9, selectionLimit:1 });
      if(res.canceled) return;
      setUploadingInline(true);
      const asset = res.assets[0];
      const remoteUrl = await uploadImageToImgBB(asset.uri);
      postToQuill({ type:'INSERT_IMAGE', url: remoteUrl });
    } catch(e:any){
      Alert.alert('Erro', 'Não foi possível inserir a imagem.');
    } finally {
      setUploadingInline(false);
    }
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // manter GIF animado
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = (asset.fileName || uri).toLowerCase();
      const gif = name.endsWith('.gif') || uri.includes('.gif');
      setIsGifBanner(gif);
      setSelectedImage(uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setIsGifBanner(false);
  };

  // Agora só pode publicar se houver banner, título e conteúdo (texto ou imagem inline)
  const canPublish = Boolean(
    selectedImage &&
    title.trim().length > 0 &&
    (plainText.trim().length > 0 || /<img/i.test(htmlContent))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[ '#252b38', '#1f2430' ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {title.trim().length > 14 ? title.trim().substring(0, 14) + '...' : (title.trim() || 'Novo Post')}
        </Text>
        <TouchableOpacity
          style={[
            styles.publishButton,
            canPublish ? styles.publishButtonActive : styles.publishButtonDisabled,
            publishing && { opacity: 0.5 }
          ]}
          onPress={handlePublish}
          disabled={!canPublish || publishing}
          activeOpacity={0.85}
        >
          <Text style={styles.publishButtonText}>{publishing ? 'Enviando...' : 'Publicar'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* (Removido bloco de identidade do usuário conforme solicitação) */}

  <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contentScrollContainer, { paddingBottom: 90 + (keyboardHeight ? Math.min(keyboardHeight, 400) : 0) }]} keyboardShouldPersistTaps="always">
        {/* Banner Image Section */}
        {!selectedImage ? (
          <TouchableOpacity style={styles.bannerPlaceholder} onPress={handleAddImage}>
            <MaterialCommunityIcons name="image-plus" size={48} color="#8b8f96" />
            <Text style={styles.bannerPlaceholderText}>Toque aqui para adicionar um banner</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bannerContainer}>
            <Image source={{ uri: selectedImage }} style={styles.bannerImage} />
            {isGifBanner && (
              <View style={styles.gifBadge}>
                <Text style={styles.gifBadgeText}>GIF</Text>
              </View>
            )}
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Title Input */}
        <View style={styles.titleSection}>
          <View style={styles.fieldHeaderRow}>
            <Text style={styles.fieldLabel}>Título</Text>
            <Text style={styles.counter}>{title.length}/{TITLE_LIMIT}</Text>
          </View>
          <TextInput
            style={styles.titleInput}
            placeholder="Escreva um título"
            placeholderTextColor="#6d7480"
            value={title}
            onChangeText={(t: string) => {
              if (t.length <= TITLE_LIMIT) setTitle(t);
            }}
            multiline={false}
          />
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.fieldHeaderRow}>
            <Text style={styles.fieldLabel}>Conteúdo</Text>
            <Text style={styles.counter}>{plainText.length}/{CONTENT_LIMIT}</Text>
          </View>
          <WebView
            ref={(r) => { webViewRef.current = r; }}
            originWhitelist={["*"]}
            source={{ html: quillHtml }}
            onMessage={(e) => {
              try {
                const data = JSON.parse(e.nativeEvent.data);
                if(data.type==='CONTENT'){
                  setHtmlContent(data.html);
                  setPlainText(data.text || '');
                }
              } catch(_) {}
            }}
            style={{ backgroundColor: 'transparent' }}
            javaScriptEnabled
            scrollEnabled
          />
        </View>
      </ScrollView>
      {/* Bottom toolbar carousel */}
  <View style={[styles.bottomBarWrapper, keyboardHeight ? { bottom: Math.min(keyboardHeight, 400) } : null]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomScrollContent}
          keyboardShouldPersistTaps="always"
        >
          <TouchableOpacity style={styles.toolButton} onPress={() => { postToQuill({type:'FOCUS'}); cycleAlignment(); }} activeOpacity={0.7}>
            {(() => {
              const a = (pendingAlignRef.current || 'left');
              if (a === 'left') return <MaterialCommunityIcons name="format-align-left" size={22} color="#fff" />;
              if (a === 'center') return <MaterialCommunityIcons name="format-align-center" size={22} color="#fff" />;
              if (a === 'right') return <MaterialCommunityIcons name="format-align-right" size={22} color="#fff" />;
              return <MaterialCommunityIcons name="format-align-justify" size={22} color="#fff" />;
            })()}
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={async () => {
            if(uploadingInline) return; 
            postToQuill({type:'FOCUS'});
            try {
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permissionResult.granted) { Alert.alert('Permissão negada', 'Acesse a galeria para inserir imagem.'); return; }
              const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing:false, quality:0.9, selectionLimit:1 });
              if(res.canceled) return;
              setUploadingInline(true);
              const asset = res.assets[0];
              const remoteUrl = await uploadImageToImgBB(asset.uri);
              postToQuill({ type:'INSERT_IMAGE', url: remoteUrl });
            } catch(err:any){
              Alert.alert('Erro', 'Não foi possível inserir a imagem.');
            } finally {
              setUploadingInline(false);
            }
          }} activeOpacity={0.7} disabled={uploadingInline}>
            {uploadingInline ? (
              <MaterialCommunityIcons name="loading" size={22} color="#ff744d" />
            ) : (
              <MaterialCommunityIcons name="image-plus" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2430',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#272e38',
    position: 'relative',
  },
  closeButton: {
    padding: 4,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    lineHeight: 56,
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: '#5a616b',
  },
  publishButtonActive: {
    backgroundColor: '#ff744d',
  },
  publishButtonDisabled: {
    backgroundColor: '#5a616b',
    opacity: 0.6,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // (Removidos estilos de identidade do usuário)
  content: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingBottom: 90,
  },
  bannerPlaceholder: {
    height: 200,
    backgroundColor: '#2a2f3a',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3a',
  },
  bannerPlaceholderText: {
    color: '#8b8f96',
    fontSize: 16,
    marginTop: 12,
  },
  // (Removidos estilos de banner avançado)
  bannerContainer: {
    position: 'relative',
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#272e38',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gifBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  gifBadgeText: {
    color: '#ffd9cf',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#272e38',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#222832',
  },
  titleInput: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    includeFontPadding: false,
    paddingVertical: 0,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#222832',
    marginTop: 8,
    // Aumentado para permitir rolagem maior do conteúdo
    minHeight: 600,
    borderTopWidth: 1,
    borderTopColor: '#272e38',
  },
  contentInput: {}, // substituído pelo rich editor
  richEditor: {
    minHeight: 240,
    width: '100%',
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    color: '#b7bcc3',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  counter: {
    color: '#6d7480',
    fontSize: 12,
    fontWeight: '500',
  },
  // (Removidos estilos de preview e hint)
  bottomBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#222832',
    borderTopWidth: 1,
    borderTopColor: '#272e38',
    paddingVertical: 8,
  },
  bottomScrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2a313c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  toolButtonDisabled: {
    opacity: 0.5,
  },
  textBlock: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
    textAlignVertical: 'top',
    minHeight: 32,
  },
  inlineImage: {
    width: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
    aspectRatio: 16/9,
    backgroundColor: '#2a2f3a'
  }
});
