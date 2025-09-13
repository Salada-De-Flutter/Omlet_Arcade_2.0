import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../context/UserContext';

export default function CriarPost() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGoBack = () => {
    router.back();
  };

  const handlePublish = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Erro', 'Adicione um título ou conteúdo para publicar');
      return;
    }
    
    // Aqui você implementaria a lógica de publicação
    Alert.alert('Sucesso', 'Post publicado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Novo Post</Text>
          <Text style={styles.headerSubtitle}>Artigo</Text>
        </View>
        
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Image Section */}
        {!selectedImage ? (
          <TouchableOpacity style={styles.addImageSection} onPress={handleAddImage}>
            <MaterialCommunityIcons name="plus" size={24} color="#8b8f96" />
            <Text style={styles.addImageText}>Adicione uma Imagem de Capa / um Título</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            <TextInput
              style={styles.imageTitleInput}
              placeholder="Adicione um título..."
              placeholderTextColor="#8b8f96"
              value={title}
              onChangeText={setTitle}
              multiline
            />
          </View>
        )}

        {/* Content Input */}
        <TextInput
          style={styles.contentInput}
          placeholder="Adicione texto..."
          placeholderTextColor="#8b8f96"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="format-font" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="format-text" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="microphone" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={handleAddImage}>
            <MaterialCommunityIcons name="image" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="paperclip" size={24} color="#8b8f96" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="hexagon" size={24} color="#8b8f96" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.toolbarRight}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>$2</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#fff" />
          </View>
          
          <TouchableOpacity style={styles.previewButton}>
            <MaterialCommunityIcons name="eye" size={20} color="#4a9eff" />
            <Text style={styles.previewButtonText}>Visualizar</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3a',
  },
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#8b8f96',
    fontSize: 14,
    marginTop: 2,
  },
  publishButton: {
    backgroundColor: '#8b8f96',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  addImageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3a',
  },
  addImageText: {
    color: '#8b8f96',
    fontSize: 16,
    marginLeft: 12,
  },
  imageContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3a',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
  imageTitleInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    minHeight: 60,
  },
  contentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 300,
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2f3a',
    backgroundColor: '#1f2430',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolbarButton: {
    padding: 8,
    marginRight: 4,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a9eff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  priceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a9eff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  previewButtonText: {
    color: '#4a9eff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
