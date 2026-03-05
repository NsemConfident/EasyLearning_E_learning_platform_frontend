import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PastQuestion } from '@/api/pastQuestions';

interface Props {
  item: PastQuestion;
  onPreview: () => void;
  onDownload: () => void;
}

const PastQuestionCard: React.FC<Props> = ({ item, onPreview, onDownload }) => {
  const categoryLabel = item.category_obj?.name ?? item.category ?? item.subject;
  const questionsCount = item.questions_count ?? null;
  const downloadsCount = item.downloads_count ?? null;

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      <View style={styles.tagsRow}>
        <View style={styles.tagCategory}>
          <Text style={styles.tagCategoryText} numberOfLines={1}>{categoryLabel}</Text>
        </View>
        <View style={styles.tagYear}>
          <Text style={styles.tagYearText}>{item.year}</Text>
        </View>
        <View style={styles.tagLevel}>
          <Text style={styles.tagLevelText} numberOfLines={1}>{item.level}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {questionsCount != null ? `${questionsCount} questions` : '— questions'}
        </Text>
        <Text style={styles.statsText}>
          {downloadsCount != null ? `${downloadsCount} downloads` : '— downloads'}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.previewButton} onPress={onPreview} activeOpacity={0.85}>
          <Ionicons name="eye-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload} activeOpacity={0.85}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagCategory: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  tagYear: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagYearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
  },
  tagLevel: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5b21b6',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statsText: {
    fontSize: 13,
    color: '#6b7280',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#167F71',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PastQuestionCard;
