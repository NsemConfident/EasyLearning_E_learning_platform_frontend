import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchPastQuestions, searchPastQuestions, PastQuestion } from '@/api/pastQuestions';
import { fetchCategories, Category } from '@/api/categories';
import PastQuestionCard from '@/components/PastQuestionCard';
import SearchBar from '@/components/SearchBar';
import NavHeader from '@/components/NavHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'App'>;

const ALL_ID = 0;

const PastQuestionsListScreen: React.FC<Props> = ({ navigation }) => {
  const [items, setItems] = useState<PastQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(ALL_ID);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const categoryParam = selectedCategoryId !== ALL_ID ? { category_id: selectedCategoryId } : undefined;
      if (query.trim()) {
        const res = await searchPastQuestions({ title: query.trim(), ...categoryParam });
        setItems(res.data);
      } else {
        const res = await fetchPastQuestions(categoryParam);
        setItems(res.data);
      }
    } finally {
      setRefreshing(false);
    }
  }, [query, selectedCategoryId]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories({ per_page: 100 });
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <NavHeader
        title="Past Questions"
        variant="dark"
        showBackButton={false}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      <SearchBar value={query} onChangeText={setQuery} onSubmit={load} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[styles.chip, selectedCategoryId === ALL_ID && styles.chipSelected]}
          onPress={() => setSelectedCategoryId(ALL_ID)}
        >
          <Text style={[styles.chipText, selectedCategoryId === ALL_ID && styles.chipTextSelected]}>All</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategoryId === cat.id && styles.chipSelected]}
            onPress={() => setSelectedCategoryId(cat.id)}
          >
            <Text style={[styles.chipText, selectedCategoryId === cat.id && styles.chipTextSelected]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  categoriesScroll: { maxHeight: 44, marginBottom: 4 },
  categoriesRow: { paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    marginRight: 8,
  },
  chipSelected: { backgroundColor: '#167F71' },
  chipText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  chipTextSelected: { color: '#fff' },
});

export default PastQuestionsListScreen;

