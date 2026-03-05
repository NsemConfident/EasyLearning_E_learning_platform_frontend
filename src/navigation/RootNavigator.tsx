import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import AuthStack from '@/navigation/AuthStack';
import AppTabs from '@/navigation/AppTabs';
import CourseDetailScreen from '@/screens/CourseDetailScreen';
import ModuleLessonsScreen from '@/screens/ModuleLessonsScreen';
import LessonScreen from '../screens/LessonScreen';
import VideoPlayerScreen from '@/screens/VideoPlayerScreen';
import PastQuestionDetailScreen from '@/screens/PastQuestionDetailScreen';
import AppSidebar, { SidebarItemId } from '@/components/AppSidebar';

export type RootStackParamList = {
  Auth: undefined;
  App: { screen?: 'Home' | 'PastQuestions' | 'Profile' } | undefined;
  CourseDetail: { courseId: number };
  ModuleLessons: { courseId: number; moduleId: number; title: string; lessons?: import('@/api/courses').Lesson[] };
  Lesson: { courseId: number; moduleId: number; moduleTitle: string; lessonId: number; lessons?: import('@/api/courses').Lesson[] };
  VideoPlayer: { lessonId: number; title: string; videoUrl: string };
  PastQuestionDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function getTabScreenForSidebarItem(item: SidebarItemId): 'Home' | 'PastQuestions' | 'Profile' {
  switch (item) {
    case 'PastQuestion':
      return 'PastQuestions';
    case 'Profile':
    case 'Setting':
      return 'Profile';
    case 'Home':
    case 'Cours':
    case 'Notifications':
    default:
      return 'Home';
  }
}

const RootNavigator = () => {
  const { user, loading } = useAuth();
  const { open, closeSidebar } = useSidebar();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const handleSidebarNavigate = (item: SidebarItemId) => {
    const screen = getTabScreenForSidebarItem(item);
    navigationRef.current?.navigate('App', { screen });
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <NavigationContainer key={user ? 'authenticated' : 'guest'} ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={user ? 'App' : 'Auth'}
        >
          {!user ? (
            <Stack.Screen name="Auth" component={AuthStack} />
          ) : (
            <>
              <Stack.Screen name="App" component={AppTabs} />
              <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
              <Stack.Screen name="ModuleLessons" component={ModuleLessonsScreen} />
              <Stack.Screen name="Lesson" component={LessonScreen} />
              <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
              <Stack.Screen name="PastQuestionDetail" component={PastQuestionDetailScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      {user && (
        <AppSidebar
          visible={open}
          onClose={closeSidebar}
          onNavigate={handleSidebarNavigate}
        />
      )}
    </>
  );
};

export default RootNavigator;

