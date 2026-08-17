export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  studentCount: number;
  averageScore: number;
  riskPercentage: number;
}

export interface CourseDetail extends Course {
  description: string;
  enrolledStudentIds: string[];
}
