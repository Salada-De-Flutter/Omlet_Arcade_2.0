import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Props = { active?: 'home' | 'live' | 'create' | 'communities' | 'chat' };

export default function BottomBar({ active = 'home' }: Props) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/home-screen')}>
          <MaterialCommunityIcons name="home-variant" size={22} color={active === 'home' ? '#ff6b58' : '#8b8f96'} />
          <Text style={[styles.footerText, active === 'home' ? { color: '#ff6b58' } : null]}>Página Inicial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarItem} onPress={() => { /* placeholder */ }}>
          <MaterialCommunityIcons name="broadcast" size={22} color={active === 'live' ? '#ff6b58' : '#8b8f96'} />
          <Text style={styles.footerText}>Ao Vivo</Text>
        </TouchableOpacity>

  <TouchableOpacity style={styles.bottomBarItem} activeOpacity={0.9} onPress={() => setShowCreate(prev => !prev)}>
          <View style={styles.centerButtonIconWrap}>
            <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/comunidades-screen')}>
          <MaterialCommunityIcons name="account-group-outline" size={22} color={active === 'communities' ? '#ff6b58' : '#8b8f96'} />
          <Text style={[styles.footerText, active === 'communities' ? { color: '#ff6b58' } : null]}>Comunidades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarItem} onPress={() => { /* placeholder */ }}>
          <MaterialCommunityIcons name="chat-outline" size={22} color={active === 'chat' ? '#ff6b58' : '#8b8f96'} />
          <Text style={styles.footerText}>Chat</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showCreate} animationType="fade">
        {/* Backdrop: tapping outside will close the modal */}
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowCreate(false)}>
          <View />
        </TouchableOpacity>
        <View style={styles.modalCardWrap} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Criar</Text>

            <View style={[styles.topOptionsRow, { justifyContent: 'space-around' }]}>
              <TouchableOpacity style={styles.optionButton} onPress={() => { setShowCreate(false); router.push('/criar-post'); }}>
                <View style={[styles.optionIconWrap, { backgroundColor: '#2ac7a8' }]}>
                  <MaterialCommunityIcons name="post" size={20} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>Criar Post</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={() => { setShowCreate(false); router.push('/criar-comunidade'); }}>
                <View style={[styles.optionIconWrap, { backgroundColor: '#ff6b58' }]}>
                  <MaterialCommunityIcons name="account-multiple-plus" size={20} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>Criar Comunidade</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
  modalBackdrop: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCardWrap: { position: 'absolute', left: 0, right: 0, bottom: 90, alignItems: 'center' },
  modalCard: { width: '92%', backgroundColor: '#23282f', borderRadius: 12, padding: 16, elevation: 10 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalButton: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#2b3138', marginTop: 6 },
  modalButtonText: { color: '#fff', fontSize: 16 },
  topOptionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  optionButton: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  optionIconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  optionLabel: { color: '#dfe6ea', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#2a2f3a', marginVertical: 10 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridItem: { flex: 1, alignItems: 'center', padding: 10 },
  gridIcon: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  gridLabel: { color: '#dfe6ea', fontSize: 12, textAlign: 'center' },
});
