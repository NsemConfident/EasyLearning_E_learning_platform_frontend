import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Course } from '@/api/courses';

interface Props {
  course: Course;
  onPress: () => void;
}

const CourseCard: React.FC<Props> = ({ course, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    {course.thumbnail && <Image source={{ uri: course.thumbnail }} style={styles.thumb} />}
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.subtitle}>{course.instructor_name}</Text>
      {course.description && (
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#0f172a',
  },
  title: { color: '#e5e7eb', fontWeight: '600', fontSize: 16 },
  subtitle: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  description: { color: '#6b7280', marginTop: 6, fontSize: 12 },
});

export default CourseCard;

