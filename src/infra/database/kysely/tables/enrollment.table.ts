export interface EnrollmentTable
{
  id: string;
	user_id: string;
	course_id: string;
  has_access: boolean;
  is_completed: boolean;
  date_created: Date;
  date_updated: Date;
}
