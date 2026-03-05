import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { fetchPastQuestions, searchPastQuestions, PastQuestion, getDownloadUrl } from '@/api/pastQuestions';
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
      const res = await fetchCategories({ type: 'past_question', per_page: 100 });
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

  const handleDownload = (item: PastQuestion) => {
    Linking.openURL(getDownloadUrl(item.id));
  };

  return (
    <View style={styles.container}>
      <NavHeader
        title="Past Questions"
        variant="light"
        showBackButton={false}
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
      />
      <View style={styles.header}>
        <Text style={styles.subtitle}>Download and practice</Text>
      </View>

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
          <Text style={[styles.chipText, selectedCategoryId === ALL_ID && styles.chipTextSelected]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategoryId === cat.id && styles.chipSelected]}
            onPress={() => setSelectedCategoryId(cat.id)}
          >
            <Text style={[styles.chipText, selectedCategoryId === cat.id && styles.chipTextSelected]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={load}
        placeholder="Search by course or department..."
        variant="light"
      />

      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PastQuestionCard
            item={item}
            onPreview={() => navigation.navigate('PastQuestionDetail', { id: item.id })}
            onDownload={() => handleDownload(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} tintColor="#2563eb" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoriesScroll: { maxHeight: 48, marginBottom: 4 },
  categoriesRow: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#167F71',
    fontWeight: '600',
  },
  listContent: { paddingTop: 8, paddingBottom: 24 },
});

export default PastQuestionsListScreen;
