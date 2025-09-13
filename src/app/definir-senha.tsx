import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function DefinirSenha() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = params.username;
  const usericon = params.usericon;
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const senhasIguais = senha === confirmarSenha && senha.length > 0;
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!senhasIguais) return;

    // don't allow spaces in password
    if (senha.includes(' ') || confirmarSenha.includes(' ')) {
      Alert.alert('Erro', 'A senha não pode conter espaços');
      return;
    }

    setLoading(true);
    const userData = {
      username: username,
      usericon: usericon,
      password: senha,
    };
    try {
      const response = await fetch('https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/criar-conta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setLoading(false);
      // after account creation, go to login so the user can sign in
      router.push('/login-screen');
    } catch (error) {
      setLoading(false);
      console.error('Erro ao enviar dados:', error);
    }
  }

  return (
    <View style={styles.container}> 
      <View style={styles.header}>
        <Image
          source={require('../../assets/Omlet_Arcade.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Definir senha</Text>
        <Text style={styles.subtitle}>Escolha uma senha segura</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.instructions}>A senha deve conter pelo menos 8 caracteres, incluindo letras e números.</Text>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputIconWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 44 }]}
            placeholder="Digite sua senha"
            placeholderTextColor="#8b8f96"
            secureTextEntry={!showSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setShowSenha(v => !v)} style={styles.inputIconBtn}>
            <MaterialCommunityIcons
              name={showSenha ? 'eye-off-outline' : 'eye-outline'}
              size={28}
              color="#ff6b58"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Confirmar senha</Text>
        <View style={styles.inputIconWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 44 }]}
            placeholder="Digite novamente sua senha"
            placeholderTextColor="#8b8f96"
            secureTextEntry={!showConfirmar}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          <TouchableOpacity onPress={() => setShowConfirmar(v => !v)} style={styles.inputIconBtn}>
            <MaterialCommunityIcons
              name={showConfirmar ? 'eye-off-outline' : 'eye-outline'}
              size={28}
              color="#ff6b58"
            />
          </TouchableOpacity>
        </View>
        {!senhasIguais && confirmarSenha.length > 0 && (
          <Text style={styles.errorText}>As senhas não coincidem.</Text>
        )}
        <TouchableOpacity
          style={styles.loginBtn}
          disabled={!senhasIguais || loading}
          onPress={handleSubmit}
        >
          <Text style={styles.loginBtnText}>{loading ? 'Enviando...' : 'Continuar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2430',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 80, // Increased size
    height: 80, // Increased size
    borderRadius: 12,
    backgroundColor: '#ff7043',
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#b8bfc6',
    fontSize: 15,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 28,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
    marginLeft: 2,
  },
  instructions: {
    color: '#b8bfc6',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 18,
    textAlign: 'center',
  },
  inputIconWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: 16, // Adjusted spacing for better layout
    backgroundColor: '#2a2e3a', // Harmonized color
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIconBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  input: {
    flex: 1,
    color: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: '#ff6b58', // Match login screen button color
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24, // Increased spacing above the button
    marginBottom: 12,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#ff6b58',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
