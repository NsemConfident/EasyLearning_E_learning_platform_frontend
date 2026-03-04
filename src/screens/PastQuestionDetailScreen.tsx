import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchPastQuestion, getDownloadUrl, PastQuestion } from '@/api/pastQuestions';

type Props = NativeStackScreenProps<RootStackParamList, 'PastQuestionDetail'>;

const PastQuestionDetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [item, setItem] = useState<PastQuestion | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await fetchPastQuestion(id);
      setItem(data);
    })();
  }, [id]);

  const handleDownload = async () => {
    if (!item) return;
    try {
      setDownloading(true);
      setProgress(0);

      const downloadUrl = getDownloadUrl(item.id);
      const fileUri = FileSystem.documentDirectory + `past-question-${item.id}.pdf`;

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const pct = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setProgress(pct);
      };

      const downloadResumable = FileSystem.createDownloadResumable(downloadUrl, fileUri, {}, callback);

      const { uri } = await downloadResumable.downloadAsync();
      Alert.alert('Download complete', 'File saved to device.', [{ text: 'OK' }]);
    } catch (e) {
      Alert.alert('Download failed', 'Unable to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  const pctText = downloading ? `${Math.round(progress * 100)}%` : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      {item.description && <Text style={styles.text}>{item.description}</Text>}
      <Text style={styles.meta}>
        {item.subject} • {item.level} • {item.year}
      </Text>
      <View style={{ marginTop: 24 }}>
        <Button
          title={downloading ? `Downloading... ${pctText}` : 'Download PDF'}
          onPress={handleDownload}
          disabled={downloading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#020617' },
  title: { color: '#e5e7eb', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  text: { color: '#d1d5db', marginTop: 4 },
  meta: { color: '#9ca3af', marginTop: 12 },
});

export default PastQuestionDetailScreen;

