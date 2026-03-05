import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchCourseProgress, enrollInCourse, Course, Module, Lesson } from '@/api/courses';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

type TabKey = 'about' | 'curriculum';

const DEFAULT_RATING = 4.2;
const DESCRIPTION_PREVIEW_LENGTH = 180;

function getTotalLessons(course: Course): number {
  if (!course.modules?.length) return 0;
  return course.modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
}

function getTotalDurationHours(course: Course): number {
  if (!course.modules?.length) return 0;
  let totalMinutes = 0;
  course.modules.forEach(m => {
    m.lessons?.forEach((l: Lesson) => {
      if (l.duration != null) totalMinutes += l.duration;
    });
  });
  return Math.round((totalMinutes / 60) * 10) / 10;
}

const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [course, setCourse] = useState<Course | null>(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totalLessons = getTotalLessons(course);
  const totalHours = getTotalDurationHours(course);
  const categoryName = course.category?.name ?? 'Course';
  const description = course.description ?? '';
  const showReadMore = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const descriptionText = descriptionExpanded || !showReadMore
    ? description
    : description.slice(0, DESCRIPTION_PREVIEW_LENGTH) + '...';
  const priceText = course.price?.endsWith('/-') ? course.price : `${course.price}/-`;

  const heroHeight = width * 0.5;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero / video area */}
        <View style={[styles.hero, { height: heroHeight }]}>
          {course.thumbnail ? (
            <Image source={{ uri: course.thumbnail }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}
          <View style={[styles.heroOverlay, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              const firstModule = course.modules?.[0];
              const firstLesson = firstModule?.lessons?.[0];
              if (firstLesson)
                navigation.navigate('VideoPlayer', {
                  lessonId: firstLesson.id,
                  title: firstLesson.title,
                  videoUrl: firstLesson.video_url,
                });
            }}
          >
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* White content card */}
        <View style={styles.card}>
          {/* Header row: category, price */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.categoryTag}>{categoryName}</Text>
            <Text style={styles.price}>{priceText}</Text>
          </View>
          <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#eab308" />
            <Text style={styles.ratingText}>{DEFAULT_RATING}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="videocam-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{totalLessons} Class</Text>
            </View>
            <Text style={styles.metaPipe}>|</Text>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{totalHours > 0 ? `${totalHours} Hours` : '— Hours'}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('about')}
            >
              <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>About</Text>
              {activeTab === 'about' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('curriculum')}
            >
              <Text style={[styles.tabText, activeTab === 'curriculum' && styles.tabTextActive]}>Curriculum</Text>
              {activeTab === 'curriculum' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {activeTab === 'about' && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{descriptionText}</Text>
              {showReadMore && (
                <TouchableOpacity onPress={() => setDescriptionExpanded(!descriptionExpanded)}>
                  <Text style={styles.readMore}>{descriptionExpanded ? 'Read less' : 'Read More'}</Text>
                </TouchableOpacity>
              )}

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Instructor</Text>
              <View style={styles.instructorRow}>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.instructorInitial}>
                    {course.instructor_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{course.instructor_name}</Text>
                  <Text style={styles.instructorRole}>{categoryName}</Text>
                </View>
                <TouchableOpacity style={styles.chatIcon}>
                  <Ionicons name="chatbubble-outline" size={22} color="#2563eb" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>What You'll Get</Text>
              <View style={styles.bulletList}>
                <BulletRow icon="book-outline" text={`${totalLessons} Lessons`} />
                <BulletRow icon="phone-portrait-outline" text="Access Mobile, Desktop & TV" />
                <BulletRow icon="stats-chart-outline" text="Beginner Level" />
                <BulletRow icon="headset-outline" text="Lifetime Access" />
                <BulletRow icon="infinite-outline" text="Certificate of Completion" />
              </View>

              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity><Text style={styles.seeAll}>SEE ALL &gt;</Text></TouchableOpacity>
              </View>
              <View style={styles.reviewCard}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewInitial}>W</Text></View>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>Will</Text>
                  <Text style={styles.reviewBody}>Great course, very clear and practical.</Text>
                  <View style={styles.reviewMeta}>
                    <View style={styles.reviewRatingBadge}><Ionicons name="star" size={12} color="#eab308" /><Text style={styles.reviewRatingNum}>4.5</Text></View>
                    <Text style={styles.reviewLikes}><Ionicons name="heart" size={12} color="#ef4444" /> 578</Text>
                    <Text style={styles.reviewDate}>2 Weeks Ago</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {activeTab === 'curriculum' && (
            <View style={styles.curriculumList}>
              {(course.modules ?? []).map((module: Module) => (
                <TouchableOpacity
                  key={module.id}
                  style={styles.moduleItem}
                  onPress={() =>
                    navigation.navigate('ModuleLessons', {
                      courseId: course.id,
                      moduleId: module.id,
                      title: module.title,
                      lessons: module.lessons ?? undefined,
                    })
                  }
                >
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleMeta}>
                    {module.lessons?.length ?? 0} lessons
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
              {(!course.modules || course.modules.length === 0) && (
                <Text style={styles.noCurriculum}>No modules yet.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed enroll button */}
      <View style={[styles.enrollBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll} activeOpacity={0.9}>
          <Text style={styles.enrollButtonText}>Enroll Course - {priceText}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function BulletRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name={icon} size={20} color="#2563eb" />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#94a3b8', fontSize: 16 },
  scroll: { flex: 1 },
  hero: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  heroImage: { ...StyleSheet.absoluteFillObject },
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
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryTag: { fontSize: 13, fontWeight: '600', color: '#ea580c' },
  price: { fontSize: 18, fontWeight: '700', color: '#2563eb' },
  courseTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ratingText: { fontSize: 15, fontWeight: '600', color: '#111827', marginLeft: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
  metaText: { fontSize: 13, color: '#6b7280', marginLeft: 4 },
  metaPipe: { fontSize: 13, color: '#d1d5db', marginRight: 8 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 20 },
  tab: { marginRight: 24, paddingBottom: 12 },
  tabText: { fontSize: 15, color: '#9ca3af', fontWeight: '500' },
  tabTextActive: { color: '#2563eb', fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#2563eb' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  bodyText: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  readMore: { fontSize: 14, color: '#2563eb', fontWeight: '600', marginTop: 6 },
  instructorRow: { flexDirection: 'row', alignItems: 'center' },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorInitial: { fontSize: 18, fontWeight: '700', color: '#4f46e5' },
  instructorInfo: { flex: 1, marginLeft: 12 },
  instructorName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  instructorRole: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  chatIcon: { padding: 8 },
  bulletList: { gap: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'center' },
  bulletText: { fontSize: 14, color: '#4b5563', marginLeft: 10 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#2563eb' },
  reviewCard: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  reviewInitial: { fontSize: 16, fontWeight: '700', color: '#475569' },
  reviewContent: { flex: 1, marginLeft: 12 },
  reviewName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  reviewBody: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  reviewRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dbeafe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  reviewRatingNum: { fontSize: 12, fontWeight: '600', color: '#1e40af', marginLeft: 4 },
  reviewLikes: { fontSize: 12, color: '#6b7280' },
  reviewDate: { fontSize: 12, color: '#9ca3af' },
  curriculumList: { gap: 0 },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  moduleTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  moduleMeta: { fontSize: 13, color: '#6b7280', marginRight: 8 },
  noCurriculum: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
  enrollBar: {
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
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  enrollButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default CourseDetailScreen;
