import { api } from '@/api/client';
import type { Category } from '@/api/categories';

/** Lesson type: video (play) or text (read) */
export type LessonType = 'video' | 'text';

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  video_url: string;
  duration: number | null;
  order: number;
  /** Optional: 'video' | 'text'. Inferred from video_url/content if missing */
  type?: LessonType;
  /** Optional: HTML or plain text for text lessons */
  content?: string | null;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order: number;
  lessons?: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price: string;
  instructor_name: string;
  is_published: boolean;
  category_id?: number | null;
  category?: Category | null;
  modules?: Module[];
}

export interface Paginated<T> {
  data: T[];
}

/** List courses. Optional category_id to filter by category. */
export const fetchCourses = async (params?: {
  category_id?: number;
}): Promise<Paginated<Course>> => {
  const res = await api.get<Paginated<Course>>('/courses', { params });
  return res.data;
};

export const fetchCourse = async (id: number): Promise<Course> => {
  const res = await api.get<Course>(`/courses/${id}`);
  return res.data;
};

/** Fetch a single module with its lessons (for curriculum and lesson screen) */
export const fetchModuleWithLessons = async (moduleId: number): Promise<Module> => {
  const res = await api.get<Module>(`/modules/${moduleId}`);
  return res.data;
};

export const enrollInCourse = async (id: number) => {
  await api.post(`/courses/${id}/enroll`);
};

export const fetchCourseProgress = async (id: number) => {
  const res = await api.get(`/courses/${id}/progress`);
  return res.data as {
    course: Course;
    stats: {
      total_lessons: number;
      completed_lessons: number;
      percentage_completed: number;
      last_lesson_id: number | null;
    };
  };
};

export const completeLesson = async (id: number) => {
  await api.post(`/lessons/${id}/complete`);
};

