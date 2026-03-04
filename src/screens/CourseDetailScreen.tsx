import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchCourse, enrollInCourse, fetchCourseProgress, Course, Module } from '@/api/courses';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<Course | null>(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const progress = await fetchCourseProgress(courseId);
        setCourse(progress.course);
        setPercentage(progress.stats.percentage_completed);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleEnroll = async () => {
    await enrollInCourse(courseId);
    const progress = await fetchCourseProgress(courseId);
    setCourse(progress.course);
    setPercentage(progress.stats.percentage_completed);
  };

  if (!course || loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  const renderModule = ({ item }: { item: Module }) => (
    <TouchableOpacity
      style={styles.module}
      onPress={() =>
        navigation.navigate('ModuleLessons', {
          courseId: course.id,
          moduleId: item.id,
          title: item.title,
        })
      }
    >
      <Text style={styles.moduleTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NavHeader
        title={course.title}
        variant="dark"
        showBackButton
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      {course.description && <Text style={styles.text}>{course.description}</Text>}
      <Text style={styles.meta}>Instructor: {course.instructor_name}</Text>
      <Text style={styles.meta}>Progress: {percentage}%</Text>
      <View style={{ marginTop: 16 }}>
        <Button title="Enroll (free)" onPress={handleEnroll} />
      </View>
      <Text style={[styles.meta, { marginTop: 24 }]}>Modules</Text>
      <FlatList
        data={course.modules || []}
        keyExtractor={m => m.id.toString()}
        renderItem={renderModule}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#020617' },
  title: { color: '#e5e7eb', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  text: { color: '#d1d5db', marginTop: 4 },
  meta: { color: '#9ca3af', marginTop: 8 },
  module: {
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  moduleTitle: { color: '#e5e7eb', fontSize: 15, fontWeight: '500' },
});

export default CourseDetailScreen;

