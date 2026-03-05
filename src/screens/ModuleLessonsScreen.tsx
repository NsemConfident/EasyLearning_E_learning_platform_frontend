import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchModuleWithLessons, Lesson, Module } from '@/api/courses';

type Props = NativeStackScreenProps<RootStackParamList, 'ModuleLessons'>;

function formatDuration(minutes: number | null): string {
  if (minutes == null) return '— Mins';
  if (minutes < 60) return `${minutes} Mins`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} Hr ${m} Mins` : `${h} Hr`;
}

function sectionDuration(lessons: Lesson[]): number {
  return lessons.reduce((sum, l) => sum + (l.duration ?? 0), 0);
}

const ModuleLessonsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId, moduleId, title, lessons: paramLessons } = route.params;
  const insets = useSafeAreaInsets();
  const hasParamLessons = (paramLessons?.length ?? 0) > 0;
  const [module, setModule] = useState<Module | null>(() =>
    hasParamLessons
      ? { id: moduleId, course_id: courseId, title, order: 0, lessons: paramLessons! }
      : null
  );
  const [loading, setLoading] = useState(!hasParamLessons);

  useEffect(() => {
    if (hasParamLessons) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchModuleWithLessons(moduleId);
        if (!cancelled) setModule(data);
      } catch {
        if (!cancelled) setModule(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [moduleId, hasParamLessons]);

  const lessons = (module?.lessons ?? []).slice().sort((a, b) => a.order - b.order);
  const sectionMins = sectionDuration(lessons);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section 01 - {title}</Text>
          <Text style={styles.sectionDuration}>{formatDuration(sectionMins)}</Text>
        </View>

        {/* Lesson list */}
        {lessons.map((lesson, index) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonRow}
            onPress={() =>
              navigation.navigate('Lesson', {
                courseId,
                moduleId,
                moduleTitle: title,
                lessonId: lesson.id,
                lessons,
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.lessonBadge}>
              <Text style={styles.lessonBadgeText}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
              <Text style={styles.lessonMeta}>{formatDuration(lesson.duration)}</Text>
            </View>
            <Ionicons name="play-circle" size={28} color="#2563eb" />
          </TouchableOpacity>
        ))}

        {lessons.length === 0 && (
          <Text style={styles.emptyText}>No lessons in this section yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  backButton: { padding: 8, marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1d4ed8' },
  sectionDuration: { fontSize: 14, color: '#6b7280' },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 2,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  lessonBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonBadgeText: { fontSize: 13, fontWeight: '700', color: '#6b7280' },
  lessonInfo: { flex: 1, minWidth: 0 },
  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  lessonMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  emptyText: { fontSize: 15, color: '#9ca3af', marginTop: 8 },
});

export default ModuleLessonsScreen;
