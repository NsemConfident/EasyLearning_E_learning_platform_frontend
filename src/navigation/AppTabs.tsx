import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import PastQuestionsListScreen from '@/screens/PastQuestionsListScreen';
import ProfileScreen from '@/screens/ProfileScreen';

export type AppTabParamList = {
  Home: undefined;
  PastQuestions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="PastQuestions" component={PastQuestionsListScreen} options={{ title: 'Past Questions' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default AppTabs;

