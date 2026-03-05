import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/RootNavigator';
import {
  fetchModuleWithLessons,
  completeLesson,
  Lesson,
  LessonType,
} from '@/api/courses';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

function getLessonType(lesson: Lesson): LessonType {
  if (lesson.type) return lesson.type;
  if (lesson.content && !lesson.video_url) return 'text';
  return 'video';
}

function formatDuration(minutes: number | null): string {
  if (minutes == null) return '— Mins';
  if (minutes < 60) return `${minutes} Mins`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} Hr ${m} Mins` : `${h} Hr`;
}

const LessonScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId, moduleId, moduleTitle, lessonId, lessons: paramLessons } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const hasParamLessons = (paramLessons?.length ?? 0) > 0;
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (!paramLessons?.length) return [];
    return paramLessons.slice().sort((a, b) => a.order - b.order);
  });
  const [loading, setLoading] = useState(!hasParamLessons);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1
    ? lessons[currentIndex + 1]
    : null;
  const lessonType = lesson ? getLessonType(lesson) : 'video';
  const isVideo = lessonType === 'video';
  const heroHeight = width * 0.45;

  useEffect(() => {
    if (hasParamLessons) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const module = await fetchModuleWithLessons(moduleId);
        const list = (module.lessons ?? []).slice().sort((a, b) => a.order - b.order);
        if (!cancelled) setLessons(list);
      } catch (e) {
        if (!cancelled) setError('Could not load lesson.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [moduleId, hasParamLessons]);

  const handlePlayVideo = () => {
    if (!lesson?.video_url) return;
    navigation.navigate('VideoPlayer', {
      lessonId: lesson.id,
      title: lesson.title,
      videoUrl: lesson.video_url,
    });
  };

  const handleNextLesson = async () => {
    if (!lesson) return;
    try {
      await completeLesson(lesson.id);
    } catch {
      // continue to next
    }
    if (nextLesson) {
      navigation.replace('Lesson', {
        courseId,
        moduleId,
        moduleTitle,
        lessonId: nextLesson.id,
      });
    } else {
      navigation.navigate('ModuleLessons', { courseId, moduleId, title: moduleTitle });
    }
  };

  if (loading || !lesson) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <Text style={styles.errorText}>{error ?? 'Lesson not found.'}</Text>
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { height: heroHeight }]}>
          <View style={styles.heroPlaceholder} />
          <View style={[styles.heroOverlay, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          {isVideo ? (
            <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
              <Ionicons name="play" size={32} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.readBadge}>
              <Ionicons name="document-text" size={28} color="#fff" />
            </View>
          )}
        </View>

        {/* White card */}
        <View style={styles.card}>
          <View style={styles.lessonBadgeRow}>
            <View style={styles.lessonBadge}>
              <Text style={styles.lessonBadgeText}>
                {String(currentIndex + 1).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
          </View>
          <Text style={styles.duration}>
            {formatDuration(lesson.duration)}
          </Text>

          {isVideo ? (
            <TouchableOpacity style={styles.playCardButton} onPress={handlePlayVideo}>
              <Ionicons name="play-circle" size={48} color="#2563eb" />
              <Text style={styles.playCardText}>Tap to play video</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView style={styles.contentScroll} nestedScrollEnabled>
              <Text style={styles.bodyText}>
                {lesson.content?.trim() || 'No content available for this lesson.'}
              </Text>
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Bottom: Next lesson / Mark complete */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson} activeOpacity={0.9}>
          <Text style={styles.nextButtonText}>
            {nextLesson ? 'Next lesson' : 'Complete & back to curriculum'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#6b7280', fontSize: 16 },
  backBtn: { position: 'absolute', top: 56, left: 16, padding: 8 },
  scroll: { flex: 1 },
  hero: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  heroPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1e293b' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 12,
  },
  backButton: { padding: 8, alignSelf: 'flex-start' },
  playButton: {
    position: 'absolute',
    bottom: -24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#167F71',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  readBadge: {
    position: 'absolute',
    bottom: -24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  lessonBadgeRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  lessonBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonBadgeText: { fontSize: 14, fontWeight: '700', color: '#6b7280' },
  lessonTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  duration: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  playCardButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  playCardText: { fontSize: 15, color: '#2563eb', fontWeight: '600', marginTop: 8 },
  contentScroll: { maxHeight: 320 },
  bodyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 12 },
    }),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default LessonScreen;
