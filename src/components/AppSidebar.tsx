import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_WIDTH_RATIO = 0.72;
const BG_DARK = '#2C2F36';
const BG_HEADER = '#393D45';
const BG_ACTIVE = '#393D45';
const TEXT_MAIN = '#E6EDF3';
const TEXT_MUTED = '#8B949E';
const BORDER_ACTIVE = '#393D45';

export type SidebarItemId = 'Home' | 'PastQuestion' | 'Cours' | 'Profile' | 'Notifications' | 'Setting';

interface AppSidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (item: SidebarItemId) => void;
  activeItem?: SidebarItemId | null;
}

const MAIN_ITEMS: { id: SidebarItemId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'Home', label: 'Home', icon: 'home-outline' },
  { id: 'PastQuestion', label: 'Past Question', icon: 'document-text-outline' },
  { id: 'Cours', label: 'Cours', icon: 'school-outline' },
  { id: 'Profile', label: 'Profile', icon: 'person-outline' },
];

const SETTINGS_ITEMS: { id: SidebarItemId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'Notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'Setting', label: 'Setting', icon: 'settings-outline' },
];

const AppSidebar: React.FC<AppSidebarProps> = ({
  visible,
  onClose,
  onNavigate,
  activeItem = null,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sidebarWidth = width * SIDEBAR_WIDTH_RATIO;
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleItemPress = (id: SidebarItemId) => {
    onNavigate(id);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sidebar, { width: sidebarWidth, paddingTop: insets.top }]} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="school" size={24} color={TEXT_MUTED} />
              </View>
              <Text style={styles.logoText}>EasyLearning</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.moreBtn}>
              <Ionicons name="ellipsis-vertical" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          {/* MAIN */}
          <Text style={styles.sectionLabel}>MAIN</Text>
          <View style={styles.section}>
            {MAIN_ITEMS.map(item => {
              const isActive = activeItem === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon} size={22} color={TEXT_MAIN} style={styles.navIcon} />
                  <Text style={styles.navText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SETTINGS */}
          <Text style={styles.sectionLabel}>SETTINGS</Text>
          <View style={styles.section}>
            {SETTINGS_ITEMS.map(item => {
              const isActive = activeItem === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon} size={22} color={TEXT_MAIN} style={styles.navIcon} />
                  <Text style={styles.navText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ minHeight: 72 }} />

          {/* Theme switcher at bottom */}
          <View style={[styles.themeBar, { paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
              onPress={() => setTheme('light')}
            >
              <Ionicons name="sunny-outline" size={20} color={theme === 'light' ? TEXT_MAIN : TEXT_MUTED} />
              <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
              onPress={() => setTheme('dark')}
            >
              <Ionicons name="moon-outline" size={20} color={theme === 'dark' ? TEXT_MAIN : TEXT_MUTED} />
              <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: BG_DARK,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG_HEADER,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { marginRight: 10 },
  logoText: { fontSize: 17, fontWeight: '700', color: TEXT_MAIN },
  moreBtn: { padding: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  section: { marginBottom: 20 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: BG_ACTIVE,
  },
  navIcon: { marginRight: 12 },
  navText: { fontSize: 15, fontWeight: '500', color: TEXT_MAIN },
  themeBar: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: BG_DARK,
    gap: 6,
  },
  themeBtnActive: {
    backgroundColor: BG_ACTIVE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  themeBtnText: { fontSize: 14, fontWeight: '600', color: TEXT_MUTED },
  themeBtnTextActive: { color: TEXT_MAIN },
});

export default AppSidebar;
