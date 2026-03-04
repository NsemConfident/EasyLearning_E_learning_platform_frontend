import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PastQuestion } from '@/api/pastQuestions';

interface Props {
  item: PastQuestion;
  onPress: () => void;
}

const formatSize = (bytes: number) => {
  if (!bytes) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const PastQuestionCard: React.FC<Props> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {item.subject} • {item.level} • {item.year}
      </Text>
      <Text style={styles.meta}>Size: {formatSize(item.file_size)}</Text>
      <Text style={styles.date}>Uploaded: {new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  title: { color: '#e5e7eb', fontWeight: '600', fontSize: 15 },
  meta: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  date: { color: '#6b7280', fontSize: 11, marginTop: 4 },
});

export default PastQuestionCard;

