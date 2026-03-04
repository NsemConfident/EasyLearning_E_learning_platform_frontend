import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/api/courses';

interface Props {
  course: Course;
  onPress: () => void;
  /** Optional category label (e.g. from API). Falls back to "Course". */
  categoryLabel?: string;
  /** Optional rating 0–5. Omitted if not provided. */
  rating?: number;
  /** Optional student count. Omitted if not provided. */
  studentsCount?: number;
}

const CourseCard: React.FC<Props> = ({
  course,
  onPress,
  categoryLabel = 'Course',
  rating,
  studentsCount,
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (e: any) => {
    e?.stopPropagation?.();
    setBookmarked(prev => !prev);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.thumbWrap}>
        {course.thumbnail ? (
          <Image source={{ uri: course.thumbnail }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.categoryTag} numberOfLines={1}>
            {categoryLabel}
          </Text>
          <TouchableOpacity
            onPress={handleBookmark}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.bookmarkWrap}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={bookmarked ? '#22c55e' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.price}>
          {course.price}
          {!course.price.endsWith('/-') ? '/-' : ''}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingWrap}>
            <Ionicons name="star" size={14} color="#eab308" />
            <Text style={styles.metaText}>{rating != null ? rating.toFixed(1) : '—'}</Text>
          </View>
          <Text style={styles.metaSeparator}>|</Text>
          <Text style={styles.metaText}>
            {studentsCount != null ? `${studentsCount} Std` : '— Std'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  thumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1f2937',
  },
  content: { flex: 1, minWidth: 0 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  bookmarkWrap: { padding: 2 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
  metaText: { fontSize: 12, color: '#6b7280' },
  metaSeparator: { fontSize: 12, color: '#d1d5db', marginRight: 6 },
});

export default CourseCard;
