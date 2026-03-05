import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const TAB_BAR_HEIGHT = 60;
const TAB_BAR_PADDING_BOTTOM = 8;

const AppTabs = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
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
      height: TAB_BAR_HEIGHT + bottomInset,
      paddingBottom: TAB_BAR_PADDING_BOTTOM + bottomInset,
      paddingTop: TAB_BAR_PADDING_BOTTOM,
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
};

export default AppTabs;

