import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha usuário e senha');
      return;
    }
    setLoading(true);
    try {
      console.log('[login] iniciando chamada get-user');
      const res = await fetch('https://chnhnptsguiuntfoeyxj.supabase.co/functions/v1/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('[login] falha parse JSON', parseErr);
        Alert.alert('Erro', 'Resposta inválida do servidor');
        return;
      }

      console.log('[login] status:', res.status);
      if (!res.ok) {
        if (res.status === 404 || res.status === 401) {
          Alert.alert('Erro', 'Usuário ou senha incorretos');
        } else {
          Alert.alert('Erro', data?.error || 'Erro ao autenticar');
        }
        console.warn('get-user error (sanitized):', { status: res.status, error: data?.error });
      } else {
        // Remove password if exists
        if (data && typeof data === 'object') {
          if ('password' in data) delete data.password;
        }
        console.log('get-user response (sanitized):', data);
        await setUser(data as any);
        console.log('[login] usuário persistido, navegando para home');
        router.push('/home-screen');
      }
    } catch (err) {
      console.error('Error calling get-user:', err);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}> 
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/Omlet_Arcade.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse sua conta Omlet Arcade</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor="#8b8f96"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={[styles.label, { marginTop: 18 }]}>Senha</Text>
        <View style={styles.inputIconWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            placeholder="Digite sua senha"
            placeholderTextColor="#8b8f96"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.inputIconBtn}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={28}
              color="#ff6b58"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Entrar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/criar-conta')}>
          <Text style={styles.createBtnText}>Criar conta</Text>
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
  },
  logo: {
    width: 80, // Increased size
    height: 80, // Increased size
    borderRadius: 12,
    backgroundColor: '#ff7043',
    marginBottom: 10,
    alignSelf: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#2a2e3a', // Harmonized color
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputIconWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: 0,
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
  showBtn: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  showBtnText: {},
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 18,
  },
  forgotText: {
    color: '#ff6b58',
    fontSize: 13,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: '#ff6b58',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  createBtn: {
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnText: {
    color: '#ff6b58',
    fontSize: 15,
    fontWeight: '700',
  },
});
