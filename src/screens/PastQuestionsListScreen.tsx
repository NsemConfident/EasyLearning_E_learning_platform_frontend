import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchPastQuestions, searchPastQuestions, PastQuestion } from '@/api/pastQuestions';
import PastQuestionCard from '@/components/PastQuestionCard';
import SearchBar from '@/components/SearchBar';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'App'>;

const PastQuestionsListScreen: React.FC<Props> = ({ navigation }) => {
  const [items, setItems] = useState<PastQuestion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = query
        ? await searchPastQuestions({ title: query })
        : await fetchPastQuestions();
      setItems(res.data);
    } finally {
      setRefreshing(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <NavHeader
        title="Past Questions"
        variant="dark"
        showBackButton={false}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      <SearchBar value={query} onChangeText={setQuery} onSubmit={load} />
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PastQuestionCard
            item={item}
            onPress={() => navigation.navigate('PastQuestionDetail', { id: item.id })}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor="#fff" />}
      />
    </View>
  );
};

export default PastQuestionsListScreen;

