import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

export type NavHeaderVariant = 'light' | 'dark';

export interface NavHeaderProps {
  title: string;
  variant?: NavHeaderVariant;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  showMenu?: boolean;
  showNotifications?: boolean;
  showAvatar?: boolean;
}

const NavHeader: React.FC<NavHeaderProps> = ({
  title,
  variant = 'dark',
  showBackButton = false,
  onBackPress,
  onMenuPress,
  onNotificationPress,
  showMenu = true,
  showNotifications = true,
  showAvatar = true,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { openSidebar } = useSidebar();

  const isLight = variant === 'light';
  const iconColor = isLight ? '#374151' : '#e5e7eb';
  const bgColor = isLight ? '#ffffff' : '#0f172a';
  const titleColor = isLight ? '#111827' : '#f8fafc';
  const borderColor = isLight ? '#e5e7eb' : '#1e293b';

  const getInitials = (name: string | undefined | null): string => {
    if (name == null || typeof name !== 'string') return '?';
    const trimmed = name.trim();
    if (!trimmed) return '?';
    return trimmed
      .split(/\s+/)
      .map(s => (s && s[0]) || '')
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top,
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Left: Back button (optional) + Title */}
        <View style={styles.left}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} size={24} color={iconColor} />
            </TouchableOpacity>
          )}
          <Text
            style={[styles.title, { color: titleColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {/* Right: Menu, Notifications, Avatar */}
        <View style={styles.right}>
          {showMenu && (
            <TouchableOpacity
              onPress={() => {
                openSidebar();
                onMenuPress?.();
              }}
              style={styles.iconButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Menu"
              accessibilityRole="button"
            >
              <Ionicons name="menu" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
          {showNotifications && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.iconButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <Ionicons name="notifications-outline" size={22} color={iconColor} />
            </TouchableOpacity>
          )}
          {showAvatar && (
            <TouchableOpacity style={styles.avatarWrap} accessibilityLabel="Profile">
              {user?.profile_photo ? (
                <Image
                  source={{ uri: user.profile_photo }}
                  style={styles.avatar}
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: isLight ? '#167F71' : '#334155' }]}>
                  <Text style={styles.avatarInitials}>
                    {user ? getInitials(user.name) : '?'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 6,
  },
  avatarWrap: {
    marginLeft: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NavHeader;
