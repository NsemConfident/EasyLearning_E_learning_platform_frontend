import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthStack';
import { useAuth } from '@/context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirm,
      });
    } catch (e: any) {
      setError('Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="Name"
        placeholderTextColor="#6b7280"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#6b7280"
        style={styles.input}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <Button title={submitting ? 'Registering...' : 'Register'} onPress={onSubmit} disabled={submitting} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#020617' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#e5e7eb', marginBottom: 24, textAlign: 'center' },
  input: {
    backgroundColor: '#020617',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#e5e7eb',
  },
  error: { color: '#f87171', marginBottom: 8, textAlign: 'center' },
  link: { marginTop: 16, color: '#38bdf8', textAlign: 'center' },
});

export default RegisterScreen;

