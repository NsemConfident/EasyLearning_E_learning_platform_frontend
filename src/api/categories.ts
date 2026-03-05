import { api } from '@/api/client';

/** Matches CategoryResource from API: id, name, slug, description */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface PaginatedCategories {
  data: Category[];
}

/** Paginated list. Optional per_page (max 100). */
export const fetchCategories = async (params?: {
  per_page?: number;
}): Promise<PaginatedCategories> => {
  const per_page = params?.per_page != null ? Math.min(100, Math.max(1, params.per_page)) : undefined;
  const res = await api.get<PaginatedCategories>('/categories', {
    params: per_page != null ? { per_page } : undefined,
  });
  return res.data;
};

/** Single category by id or slug */
export const fetchCategory = async (idOrSlug: number | string): Promise<Category> => {
  const res = await api.get<Category>(`/categories/${idOrSlug}`);
  return res.data;
};
