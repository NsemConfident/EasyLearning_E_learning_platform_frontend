import './global.css';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SidebarProvider>
          <RootNavigator />
        </SidebarProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
