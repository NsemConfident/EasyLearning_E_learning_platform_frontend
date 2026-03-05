import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchPastQuestion, getDownloadUrl, PastQuestion } from '@/api/pastQuestions';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'PastQuestionDetail'>;

type TabKey = 'question' | 'answer';

const PastQuestionDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [item, setItem] = useState<PastQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('question');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPastQuestion(id);
        if (!cancelled) setItem(data);
      } catch (e) {
        if (!cancelled) setError('Unable to load past question.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!item || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  const questionUrl = item.question_pdf_url ?? getDownloadUrl(item.id);
  const answerUrl = item.answer_pdf_url ?? item.question_pdf_url ?? getDownloadUrl(item.id);
  const activeUrl = tab === 'question' ? questionUrl : answerUrl;

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, tab === 'question' && styles.tabActive]}
        onPress={() => setTab('question')}
      >
        <Text style={[styles.tabText, tab === 'question' && styles.tabTextActive]}>Question</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, tab === 'answer' && styles.tabActive]}
        onPress={() => setTab('answer')}
      >
        <Text style={[styles.tabText, tab === 'answer' && styles.tabTextActive]}>Answer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <NavHeader
        title={item.title}
        variant="dark"
        showBackButton
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      <View style={styles.header}>
        {item.description && <Text style={styles.subtitle}>{item.description}</Text>}
        <Text style={styles.meta}>
          {item.subject} • {item.level} • {item.year}
        </Text>
      </View>
      {renderTabs()}
      <View style={styles.viewerContainer}>
        {!activeUrl ? (
          <View style={styles.viewerFallback}>
            <Text style={styles.viewerFallbackText}>
              {tab === 'question'
                ? 'No question PDF available.'
                : 'No answer PDF available.'}
            </Text>
          </View>
        ) : (
          <WebView
            source={{ uri: activeUrl }}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading PDF…</Text>
              </View>
            )}
            onError={() => setError('Failed to load PDF. Please try again.')}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1120' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1120',
  },
  loadingText: { marginTop: 8, color: '#9ca3af' },
  errorText: { marginTop: 8, color: '#f97316', textAlign: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#020617',
  },
  subtitle: { color: '#e5e7eb', fontSize: 14, marginBottom: 4 },
  meta: { color: '#9ca3af', fontSize: 13 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tab: {
    marginRight: 16,
    paddingBottom: 10,
  },
  tabActive: {},
  tabText: { fontSize: 15, color: '#64748b', fontWeight: '500' },
  tabTextActive: { color: '#e5e7eb', fontWeight: '700' },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#020617',
  },
  webview: { flex: 1 },
  webviewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  viewerFallbackText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PastQuestionDetailScreen;

