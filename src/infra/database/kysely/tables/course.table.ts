import { CourseLevel } from "@/core/repositories/course-level";
import { CourseModality } from "@/core/repositories/course-modalidad";

export interface CourseTable
{
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  level: CourseLevel;
  modality: CourseModality;
  location?: string | null;
  startDate: Date;
  isPopular: boolean;
  tags: string[];
  date_created: Date;
  date_updated: Date;
	date_deleted: Date | null;
}
