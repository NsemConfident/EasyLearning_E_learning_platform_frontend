import { api } from '@/api/client';

export interface PastQuestion {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  year: string;
  category: string | null;
  file_size: number;
  is_published: boolean;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
}

export const fetchPastQuestions = async (): Promise<Paginated<PastQuestion>> => {
  const res = await api.get<Paginated<PastQuestion>>('/past-questions');
  return res.data;
};

export const fetchPastQuestion = async (id: number): Promise<PastQuestion> => {
  const res = await api.get<PastQuestion>(`/past-questions/${id}`);
  return res.data;
};

export const searchPastQuestions = async (params: {
  title?: string;
  subject?: string;
  year?: string;
  level?: string;
}): Promise<Paginated<PastQuestion>> => {
  const res = await api.get<Paginated<PastQuestion>>('/past-questions/search', {
    params,
  });
  return res.data;
};

export const getDownloadUrl = (id: number) => {
  return `${api.defaults.baseURL}/past-questions/${id}/download`;
};

