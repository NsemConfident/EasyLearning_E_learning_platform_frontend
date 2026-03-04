import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { completeLesson } from '@/api/courses';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen: React.FC<Props> = ({ route }) => {
  const { lessonId, title, videoUrl } = route.params;

  const handleEnd = async () => {
    await completeLesson(lessonId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        shouldPlay
        onPlaybackStatusUpdate={status => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            handleEnd();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#020617' },
  title: { color: '#e5e7eb', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  video: { flex: 1, backgroundColor: 'black', borderRadius: 8 },
});

export default VideoPlayerScreen;

