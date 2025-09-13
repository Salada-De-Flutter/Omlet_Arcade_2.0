import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}> 
      <StatusBar style="light" />

      <View style={styles.header}> 
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/Omlet_Arcade.webp')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>OMLET ARCADE</Text>
        </View>
      </View>

      <View style={styles.heroWrap}>
        <Image
          // local asset (replace if you have a dedicated hero image)
          source={require('../../assets/Banner.png')}
          style={styles.hero}
          resizeMode="cover"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>
          Omlet Arcade é a forma mais fácil de gravar e transmitir ao vivo suas aventuras de jogos
        </Text>

        <TouchableOpacity style={styles.cta} onPress={() => router.push('/criar-conta')}>
          <Text style={styles.ctaText}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerDisclaimer}>
        <Text style={styles.disclaimerText}>
          Ao continuar, você está nos confirmando que tem 13 anos ou mais, e concorda com{' '}
          <Text style={styles.link}>Termos</Text> & <Text style={styles.link}>Política de Privacidade</Text>
        </Text>
      </View>

  <View style={styles.bottomBar}> 
        <TouchableOpacity style={styles.bottomBtn} onPress={() => console.log('Pular pressed')}>
          <Text style={styles.bottomText}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomBtn, styles.middle]} onPress={() => router.push('/login-screen')}>
          <Text style={styles.bottomText}>Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2430'
  },
  header: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: width * 0.6,
    height: 60
  },
  logoText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoIcon: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#ff7043',
    marginRight: 12
  },
  heroWrap: {
    alignItems: 'center'
  },
  hero: {
    width: width * 0.9,
    height: 180,
    borderRadius: 8
  },
  body: {
    paddingHorizontal: 28,
    marginTop: 22,
  alignItems: 'center',
  marginBottom: 20
  },
  description: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 18
  },
  cta: {
    backgroundColor: '#ff6b58',
    paddingVertical: 12,
    paddingHorizontal: 38,
    borderRadius: 8
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  footerDisclaimer: {
    marginTop: 28,
    paddingHorizontal: 20,
    // keep disclaimer above bottom bar
    marginBottom: 12
  },
  disclaimerText: {
    color: '#a0a6b0',
    fontSize: 12,
    textAlign: 'center'
  },
  link: {
    color: '#ff7a60',
    textDecorationLine: 'underline'
  },
  bottomBar: {
    position: 'absolute',
    
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2a2f3a',
    backgroundColor: '#1f2430'
  },
  bottomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  middle: {
    borderLeftWidth: 1,
    borderLeftColor: '#2a2f3a'
  }
});