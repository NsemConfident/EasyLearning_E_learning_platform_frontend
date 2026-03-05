import { api } from '@/api/client';
import type { Category } from '@/api/categories';

export interface PastQuestion {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  year: string;
  category: string | null;
  category_id?: number | null;
  category_obj?: Category | null;
  file_size: number;
  is_published: boolean;
  created_at: string;
  /** Optional: number of questions (if provided by API) */
  questions_count?: number | null;
  /** Optional: download count (if provided by API) */
  downloads_count?: number | null;
}

export interface Paginated<T> {
  data: T[];
}

/** List past questions. Optional category_id to filter. */
export const fetchPastQuestions = async (params?: {
  category_id?: number;
}): Promise<Paginated<PastQuestion>> => {
  const res = await api.get<Paginated<PastQuestion>>('/past-questions', { params });
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
  category_id?: number;
}): Promise<Paginated<PastQuestion>> => {
  const res = await api.get<Paginated<PastQuestion>>('/past-questions/search', {
    params,
  });
  return res.data;
};

export const getDownloadUrl = (id: number) => {
  return `${api.defaults.baseURL}/past-questions/${id}/download`;
};

