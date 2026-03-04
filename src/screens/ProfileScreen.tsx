import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <>
          <Text style={styles.text}>{user.name}</Text>
          <Text style={styles.text}>{user.email}</Text>
          <Text style={styles.text}>Role: {user.role}</Text>
        </>
      )}
      <View style={{ marginTop: 24 }}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#020617' },
  title: { color: '#e5e7eb', fontSize: 20, fontWeight: '600', marginBottom: 16 },
  text: { color: '#d1d5db', marginTop: 4 },
});

export default ProfileScreen;

