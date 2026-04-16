export type StudentStatus = 'neutral' | 'identified' | 'unidentified' | 'confirmed';

export interface Student {
  id: string;
  deskIndex: number;
  name: string;
  rollNumber: string;
  srn: string;
  status: StudentStatus;
  confidence: number;
  isIdentified: boolean;
  manuallyAssigned?: boolean;
}

export interface Desk {
  id: string;
  row: number;
  col: number;
  occupied: boolean;
  student?: Student;
}

export interface SessionConfig {
  academicYear: string;
  division: string;
  batch: string;
  classroom: string;
}

export interface SessionSummary {
  totalDesks: number;
  identified: number;
  unidentified: number;
  confirmed: number;
  manualCorrections: number;
  attendancePercentage: number;
}
