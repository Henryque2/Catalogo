import React, { useState } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity,
  StyleSheet, TextInput, useWindowDimensions,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useScrollContext } from '../context/ScrollContext';

const AVATARS = ['👽', '🎭', '🎥', '🍿', '⭐', '🎞️', '🦁', '🐉', '🚀', '👾'];

const ProfileScreen = ({ navigateTo }) => {
  const { profile, updateProfile, favorites, watched, theme, toggleTheme } = useFavorites();
  const { handleScroll } = useScrollContext();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const saveName = () => {
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => handleScroll(e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Avatar + Nome */}
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>{profile.avatar}</Text>

        {editingName ? (
          <View style={styles.nameEditRow}>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              autoFocus
              onSubmitEditing={saveName}
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveName} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { setNameInput(profile.name); setEditingName(true); }} activeOpacity={0.8}>
            <Text style={styles.profileName}>{profile.name} ✏️</Text>
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{watched.length}</Text>
            <Text style={styles.statLabel}>Assistidos</Text>
          </View>
        </View>
      </View>

      {/* Escolher avatar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolher Avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((av) => (
            <TouchableOpacity
              key={av}
              style={[styles.avatarOption, profile.avatar === av && styles.avatarOptionActive]}
              onPress={() => updateProfile({ avatar: av })}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarOptionText}>{av}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Preferências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.prefLabel}>Tema</Text>
            <Text style={styles.prefSub}>Aparência do aplicativo</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, theme === 'light' && styles.toggleOn]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleThumb, theme === 'light' && styles.toggleThumbOn]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.themeLabel}>{theme === 'dark' ? '🌙 Escuro' : '☀️ Claro'}</Text>
      </View>

      {/* Filmes assistidos */}
      {watched.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Assistidos ({watched.length})</Text>
          <View style={styles.watchedList}>
            {watched.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.watchedItem}
                onPress={() => navigateTo('detail', m)}
                activeOpacity={0.8}
              >
                <Text style={styles.watchedTitle}>{m.title}</Text>
                <Text style={styles.watchedYear}>{m.year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { flexGrow: 1, paddingBottom: 32 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  profileCard: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  avatar: { fontSize: 72 },
  profileName: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  nameEditRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  nameInput: {
    color: '#fff', fontSize: 18, fontWeight: '600',
    borderBottomWidth: 2, borderBottomColor: '#e50914',
    paddingVertical: 4, paddingHorizontal: 8, minWidth: 140,
  },
  saveBtn: {
    backgroundColor: '#e50914', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24, gap: 24,
    width: '100%', justifyContent: 'center', marginTop: 4,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '500' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: {
    color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 14, letterSpacing: -0.3,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  avatarOption: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarOptionActive: { borderColor: '#e50914', backgroundColor: 'rgba(229,9,20,0.15)' },
  avatarOptionText: { fontSize: 28 },
  preferenceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 8,
  },
  prefLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  prefSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  toggle: {
    width: 48, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)', padding: 2, justifyContent: 'center',
  },
  toggleOn: { backgroundColor: '#e50914' },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  themeLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 13, paddingLeft: 4 },
  watchedList: { gap: 8 },
  watchedItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  watchedTitle: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  watchedYear: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});

export default ProfileScreen;
