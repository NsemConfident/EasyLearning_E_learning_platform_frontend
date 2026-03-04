import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Course } from '@/api/courses';

type Props = NativeStackScreenProps<RootStackParamList, 'ModuleLessons'>;

const ModuleLessonsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId, moduleId, title } = route.params;
  // For simplicity, expect course with modules/lessons already loaded in detail screen
  // In production, you might re-fetch module lessons here.

  // Placeholder UI – you can wire state or context to pass lessons here.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Implement lessons list by fetching lessons for this module.</Text>
      {/* Example of navigating to VideoPlayer:
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('VideoPlayer', {
            lessonId: 1,
            title: 'Lesson 1',
            videoUrl: 'https://example.com/video.mp4',
          })
        }
      >
        <Text style={styles.link}>Go to video</Text>
      </TouchableOpacity>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#020617' },
  title: { color: '#e5e7eb', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  text: { color: '#d1d5db', marginTop: 4 },
  link: { color: '#38bdf8', marginTop: 16 },
});

export default ModuleLessonsScreen;

