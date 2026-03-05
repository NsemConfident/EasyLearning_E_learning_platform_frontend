import { api } from '@/api/client';

/** Category type: course categories vs past-question categories (e.g. HND, GCE). */
export type CategoryType = 'course' | 'past_question';

/** Matches CategoryResource: id, name, slug, description, type */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: CategoryType;
}

export interface PaginatedCategories {
  data: Category[];
}

/**
 * Paginated list.
 * Optional type=course or type=past_question to filter (backend only returns categories of that type).
 * Optional per_page (max 100).
 */
export const fetchCategories = async (params?: {
  type?: CategoryType;
  per_page?: number;
}): Promise<PaginatedCategories> => {
  const per_page = params?.per_page != null ? Math.min(100, Math.max(1, params.per_page)) : undefined;
  const query: { type?: CategoryType; per_page?: number } = {};
  if (params?.type) query.type = params.type;
  if (per_page != null) query.per_page = per_page;
  const res = await api.get<PaginatedCategories>('/categories', {
    params: Object.keys(query).length ? query : undefined,
  });
  return res.data;
};

/** Single category by id or slug */
export const fetchCategory = async (idOrSlug: number | string): Promise<Category> => {
  const res = await api.get<Category>(`/categories/${idOrSlug}`);
  return res.data;
};
