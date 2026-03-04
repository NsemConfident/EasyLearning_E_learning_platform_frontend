import { api } from '@/api/client';

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  video_url: string;
  duration: number | null;
  order: number;
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
  modules?: Module[];
}

export interface Paginated<T> {
  data: T[];
}

export const fetchCourses = async (): Promise<Paginated<Course>> => {
  const res = await api.get<Paginated<Course>>('/courses');
  return res.data;
};

export const fetchCourse = async (id: number): Promise<Course> => {
  const res = await api.get<Course>(`/courses/${id}`);
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

