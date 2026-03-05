import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import AuthStack from '@/navigation/AuthStack';
import AppTabs from '@/navigation/AppTabs';
import CourseDetailScreen from '@/screens/CourseDetailScreen';
import ModuleLessonsScreen from '@/screens/ModuleLessonsScreen';
import LessonScreen from '@/screens/LessonScreen';
import VideoPlayerScreen from '@/screens/VideoPlayerScreen';
import PastQuestionDetailScreen from '@/screens/PastQuestionDetailScreen';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  CourseDetail: { courseId: number };
  ModuleLessons: { courseId: number; moduleId: number; title: string; lessons?: import('@/api/courses').Lesson[] };
  Lesson: { courseId: number; moduleId: number; moduleTitle: string; lessonId: number; lessons?: import('@/api/courses').Lesson[] };
  VideoPlayer: { lessonId: number; title: string; videoUrl: string };
  PastQuestionDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer key={user ? 'authenticated' : 'guest'}>
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
  );
};

export default RootNavigator;

