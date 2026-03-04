import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchCourses, Course } from '@/api/courses';
import CourseCard from '@/components/CourseCard';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'App'>;

const CATEGORIES = ['All', 'Programming', 'Design', 'Web Development', 'Marketing', 'Business'];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchCourses();
      setCourses(res.data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter(
          c =>
            c.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            (c.description?.toLowerCase().includes(selectedCategory.toLowerCase()) ?? false)
        );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <NavHeader
        title="Courses"
        variant="light"
        showBackButton={false}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      <View style={styles.container}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} tintColor="#22c55e" />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  categoriesScroll: { maxHeight: 44, marginBottom: 8 },
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  chipSelected: { backgroundColor: '#22c55e' },
  chipText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  chipTextSelected: { color: '#ffffff' },
  listContent: { padding: 16, paddingBottom: 24 },
});

export default HomeScreen;
