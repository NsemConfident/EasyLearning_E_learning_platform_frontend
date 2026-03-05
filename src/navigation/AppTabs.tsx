import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import PastQuestionsListScreen from '@/screens/PastQuestionsListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

export type AppTabParamList = {
  Home: undefined;
  PastQuestions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppTabs = () => (
  
  <Tab.Navigator 
  screenOptions={({ route }) => ({
    headerShown: false,

    tabBarIcon: ({ focused, color, size }) => {
      let iconName: keyof typeof Ionicons.glyphMap;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } 
      else if (route.name === 'PastQuestions') {
        iconName = focused
          ? 'document-text'
          : 'document-text-outline';
      } 
      else {
        iconName = focused ? 'person' : 'person-outline';
      }

      return (
        <Ionicons name={iconName} size={size} color={color} />
      );
    },

    tabBarActiveTintColor: '#167F71',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      height: 60,
      paddingBottom: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
  })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="PastQuestions" component={PastQuestionsListScreen} options={{ title: 'Past Questions' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default AppTabs;

