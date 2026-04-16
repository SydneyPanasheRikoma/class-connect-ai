import { Student, Desk } from './types';

const studentData: Omit<Student, 'deskIndex' | 'status' | 'manuallyAssigned'>[] = [
  { id: '1', name: 'Aiden Smith', rollNumber: 'FYA01', srn: 'SRN2023001', confidence: 96, isIdentified: true },
  { id: '2', name: 'Emily Carter', rollNumber: 'FYA02', srn: 'SRN2023002', confidence: 94, isIdentified: true },
  { id: '3', name: 'Liam Johnson', rollNumber: 'FYA03', srn: 'SRN2023003', confidence: 91, isIdentified: true },
  { id: '4', name: 'Aarav Sharma', rollNumber: 'FYA04', srn: 'SRN2023004', confidence: 98, isIdentified: true },
  { id: '5', name: 'Neha Kulkarni', rollNumber: 'FYA05', srn: 'SRN2023005', confidence: 89, isIdentified: true },
  { id: '6', name: 'Riya Mehta', rollNumber: 'FYA06', srn: 'SRN2023006', confidence: 93, isIdentified: true },
  { id: '7', name: 'Aditya Verma', rollNumber: 'FYA07', srn: 'SRN2023007', confidence: 97, isIdentified: true },
  { id: '8', name: 'Priya Iyer', rollNumber: 'FYA08', srn: 'SRN2023008', confidence: 92, isIdentified: true },
  { id: '9', name: 'Kabir Singh', rollNumber: 'FYA09', srn: 'SRN2023009', confidence: 95, isIdentified: true },
  { id: '10', name: 'Anika Patel', rollNumber: 'FYA10', srn: 'SRN2023010', confidence: 90, isIdentified: true },
  { id: '11', name: 'Tendai Moyo', rollNumber: 'FYA11', srn: 'SRN2023011', confidence: 88, isIdentified: true },
  { id: '12', name: 'Tariro Chikore', rollNumber: 'FYA12', srn: 'SRN2023012', confidence: 99, isIdentified: true },
  { id: '13', name: 'Rudo Nhamo', rollNumber: 'FYA13', srn: 'SRN2023013', confidence: 85, isIdentified: true },
  { id: '14', name: 'Unknown', rollNumber: '', srn: '', confidence: 0, isIdentified: false },
  { id: '15', name: 'Unknown', rollNumber: '', srn: '', confidence: 0, isIdentified: false },
  { id: '16', name: 'Kudakwashe Bvuma', rollNumber: 'FYA14', srn: 'SRN2023014', confidence: 91, isIdentified: true },
  { id: '17', name: 'Nyasha Moyo', rollNumber: 'FYA15', srn: 'SRN2023015', confidence: 87, isIdentified: true },
  { id: '18', name: 'Unknown', rollNumber: '', srn: '', confidence: 0, isIdentified: false },
];

export function generateStudents(): Student[] {
  return studentData.map((s, i) => ({
    ...s,
    deskIndex: i,
    status: 'neutral' as const,
  }));
}

export function generateDesks(students: Student[]): Desk[] {
  const rows = 5;
  const cols = 4;
  const desks: Desk[] = [];
  let studentIdx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (studentIdx < students.length) {
        desks.push({
          id: `desk-${idx}`,
          row: r,
          col: c,
          occupied: true,
          student: students[studentIdx],
        });
        studentIdx++;
      } else {
        desks.push({ id: `desk-${idx}`, row: r, col: c, occupied: false });
      }
    }
  }
  return desks;
}

export const cascadeData = {
  academicYears: ['FY', 'SY', 'TY'],
  divisions: ['A', 'B', 'C', 'D'],
  batches: ['Batch 1', 'Batch 2', 'Batch 3'],
  classrooms: {
    'FY-A-Batch 1': '2211',
    'FY-A-Batch 2': '2212',
    'FY-A-Batch 3': '2213',
    'FY-B-Batch 1': '2213',
    'FY-B-Batch 2': '2214',
    'FY-B-Batch 3': '2211',
    'FY-C-Batch 1': '2215',
    'FY-C-Batch 2': '2216',
    'FY-C-Batch 3': '2212',
    'FY-D-Batch 1': '2214',
    'FY-D-Batch 2': '2215',
    'FY-D-Batch 3': '2216',
    'SY-A-Batch 1': '2212',
    'SY-A-Batch 2': '2213',
    'SY-A-Batch 3': '2214',
    'SY-B-Batch 1': '2211',
    'SY-B-Batch 2': '2215',
    'SY-B-Batch 3': '2216',
    'SY-C-Batch 1': '2213',
    'SY-C-Batch 2': '2214',
    'SY-C-Batch 3': '2215',
    'SY-D-Batch 1': '2216',
    'SY-D-Batch 2': '2211',
    'SY-D-Batch 3': '2212',
    'TY-A-Batch 1': '2214',
    'TY-A-Batch 2': '2215',
    'TY-A-Batch 3': '2216',
    'TY-B-Batch 1': '2212',
    'TY-B-Batch 2': '2213',
    'TY-B-Batch 3': '2211',
    'TY-C-Batch 1': '2216',
    'TY-C-Batch 2': '2211',
    'TY-C-Batch 3': '2212',
    'TY-D-Batch 1': '2215',
    'TY-D-Batch 2': '2216',
    'TY-D-Batch 3': '2213',
  } as Record<string, string>,
};

export interface RecentSession {
  date: string;
  class: string;
  attendance: number;
  confirmed: boolean;
}

export const recentSessions: RecentSession[] = [
  { date: '2026-04-15', class: 'FY-A Batch 1 (2211)', attendance: 94, confirmed: false },
  { date: '2026-04-14', class: 'SY-C Batch 3 (2215)', attendance: 88, confirmed: true },
];
