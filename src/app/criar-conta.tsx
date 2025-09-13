import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CriarConta() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      }
    })();
  }, []);

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9
      });

      // new expo returns result.assets
      if (!result.canceled && (result as any).assets && (result as any).assets.length > 0) {
        const uri = (result as any).assets[0].uri;
        setImageUri(uri);
      } else if (!result.canceled && (result as any).uri) {
        // fallback for older versions
        setImageUri((result as any).uri);
      }
    } catch (err) {
      console.warn('image pick error', err);
    }
  }

  async function uploadImageToImgBB(imageUri: string) {
    const apiKey = '403f04793c78d56e5458d53f3c240b4e';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url; // Retorna a URL da imagem
      } else {
        throw new Error('Erro ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  }

  async function handleContinue() {
    if (!imageUri || !userId.trim()) return;

    // don't allow spaces in username
    if (userId.includes(' ')) {
      Alert.alert('Erro', 'O nome de usuário não pode conter espaços');
      return;
    }

    setIsLoading(true);

    try {
      const uploadedImageUrl = await uploadImageToImgBB(imageUri);

      const userData = {
        username: userId,
        usericon: uploadedImageUrl,
      };

      console.log(userData);

      router.push({
        pathname: '/definir-senha',
        params: {
          username: userData.username,
          usericon: userData.usericon,
        },
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer o upload da imagem.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}> 
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}> 
        <Text style={styles.title}>BEM-VINDO à Omlet!</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Defina uma foto e uma ID</Text>

        <TouchableOpacity style={styles.cameraCircle} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.cameraPreview} resizeMode="cover" />
          ) : (
            <Ionicons name="camera-outline" size={56} color="#ff6b58" />
          )}
        </TouchableOpacity>
        <Text style={styles.cameraText}>Escolher foto</Text>

        <TextInput
          value={userId}
          onChangeText={setUserId}
          placeholder="Criar ID de usuário"
          placeholderTextColor="#7f858b"
          style={styles.textInput}
        />
        <View style={styles.inputUnderline} />

        <TouchableOpacity
          style={[styles.continueBtn, (imageUri && userId.trim().length > 0) ? styles.continueBtnActive : null]}
          disabled={!(imageUri && userId.trim().length > 0) || isLoading}
          onPress={handleContinue}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.continueText, (imageUri && userId.trim().length > 0) ? { color: '#fff' } : null]}>CONTINUAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footerDisclaimer}>
        <Text style={styles.disclaimerText}>
          Ao continuar, você está nos confirmando que tem 13 anos ou mais, e concorda com <Text style={styles.link}>Termos</Text> & <Text style={styles.link}>Política de Privacidade</Text> da Omlet
        </Text>
      </View>

      <View style={styles.bottomBar}> 
        <TouchableOpacity style={styles.bottomBtn} onPress={() => router.push('/login-screen')}>
          <Text style={styles.bottomText}>Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f2430' },
  header: { alignItems: 'center', marginTop: 8 },
  title: { color: '#fff', fontSize: 30, fontWeight: '700' },
  content: { alignItems: 'center', marginTop: 18, paddingHorizontal: 24 },
  subtitle: { color: '#8b8f96', marginBottom: 12 },
  cameraCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#111217',
    borderWidth: 2,
    borderColor: '#ff6b58',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 12,
  overflow: 'hidden'
  },
  cameraIcon: { width: 56, height: 56, tintColor: '#ff6b58' },
  cameraText: { color: '#ff6b58', marginTop: 12, marginBottom: 6 },
  cameraPreview: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  createId: { color: '#fff', fontSize: 26, marginTop: 18 },
  textInput: { width: '80%', color: '#fff', paddingVertical: 8, textAlign: 'center', fontSize: 24 },
  inputUnderline: { height: 2, backgroundColor: '#ff6b58', width: '80%', marginTop: 8 },
  continueBtn: { marginTop: 24, backgroundColor: '#111217', paddingVertical: 14, width: '80%', alignItems: 'center', borderRadius: 6 },
  continueBtnActive: { backgroundColor: '#ff6b58' },
  continueText: { color: '#555', fontWeight: '700' },
  footerDisclaimer: { paddingHorizontal: 20, marginTop: 24 },
  disclaimerText: { color: '#9aa0a8', textAlign: 'center', fontSize: 12 },
  link: { color: '#ff7a60', textDecorationLine: 'underline' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#2a2f3a', backgroundColor: '#1f2430' },
  bottomBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomText: { color: '#fff', fontSize: 16 }
});
