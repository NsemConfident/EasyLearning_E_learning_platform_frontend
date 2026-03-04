import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 1500;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EASYLEARNING</Text>
      <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 16 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e7eb',
  },
});

export default SplashScreen;

