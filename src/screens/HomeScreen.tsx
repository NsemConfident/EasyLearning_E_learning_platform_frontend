import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { fetchCategories, Category } from '@/api/categories';
import CourseCard from '@/components/CourseCard';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'App'>;

const ALL_ID = 0;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(ALL_ID);
  const isFirstCategoryEffect = useRef(true);

  const loadCourses = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchCourses(
        selectedCategoryId === ALL_ID ? undefined : { category_id: selectedCategoryId }
      );
      setCourses(res.data);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategoryId]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories({ per_page: 100 });
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  }, []);

  const load = useCallback(async () => {
    await loadCategories();
    await loadCourses();
  }, [loadCategories, loadCourses]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isFirstCategoryEffect.current) {
      isFirstCategoryEffect.current = false;
      return;
    }
    loadCourses();
  }, [selectedCategoryId, loadCourses]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <NavHeader
        title="Courses"
        variant="dark"
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
          <TouchableOpacity
            key="all"
            style={[styles.chip, selectedCategoryId === ALL_ID && styles.chipSelected]}
            onPress={() => setSelectedCategoryId(ALL_ID)}
          >
            <Text style={[styles.chipText, selectedCategoryId === ALL_ID && styles.chipTextSelected]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, selectedCategoryId === cat.id && styles.chipSelected]}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text style={[styles.chipText, selectedCategoryId === cat.id && styles.chipTextSelected]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={courses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              categoryLabel={item.category?.name ?? 'Course'}
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
  categoriesScroll: { maxHeight: 70},
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  chipSelected: { 
    backgroundColor: '#167F71',
   },
  chipText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  chipTextSelected: { color: '#ffffff' },
  listContent: { padding: 16, paddingBottom: 24 },
});

export default HomeScreen;
