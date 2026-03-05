import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  /** Light theme: light gray background and placeholder for use on light screens */
  variant?: 'dark' | 'light';
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search...',
  variant = 'dark',
}) => {
  const isLight = variant === 'light';
  return (
    <View style={[styles.container, isLight && styles.containerLight]}>
      <Ionicons
        name="search"
        size={20}
        color={isLight ? '#9ca3af' : '#6b7280'}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, isLight && styles.inputLight]}
        placeholder={placeholder}
        placeholderTextColor={isLight ? '#9ca3af' : '#6b7280'}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#020617',
  },
  containerLight: {
    backgroundColor: '#f9fafb',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e5e7eb',
    fontSize: 15,
  },
  inputLight: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    color: '#111827',
  },
});

export default SearchBar;

