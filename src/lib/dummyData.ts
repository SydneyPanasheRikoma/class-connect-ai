import { Student, Desk } from './types';

const DESK_ROWS = 5;
const DESK_COLS = 4;
const SEATS_PER_DESK = 2;
const TOTAL_SEATS = DESK_ROWS * DESK_COLS * SEATS_PER_DESK;
const ABSENT_SEATS_COUNT = 3;
const FIXED_UNIDENTIFIED_ROLL_NUMBERS = [12, 22, 27] as const;
const FIXED_UNIDENTIFIED_SEAT_POSITIONS = new Set(
  FIXED_UNIDENTIFIED_ROLL_NUMBERS.map((roll) => roll - 1)
);

const identifiedNames = [
  'Aiden Smith',
  'Emily Carter',
  'Liam Johnson',
  'Aarav Sharma',
  'Neha Kulkarni',
  'Riya Mehta',
  'Aditya Verma',
  'Priya Iyer',
  'Kabir Singh',
  'Anika Patel',
  'Tendai Moyo',
  'Tariro Chikore',
  'Rudo Nhamo',
  'Kudakwashe Bvuma',
  'Nyasha Moyo',
  'Zainab Hassan',
  'Raj Patel',
  'Maya Desai',
  'Mohammed Ali',
  'Sophia Brown',
  'Diego Martinez',
  'Olivia Johnson',
  'Chen Wei',
  'Priya Singh',
  'Kofi Mensah',
  'Amelia White',
  'Viktor Petrov',
  'Fatima Khan',
  'Lucas Silva',
  'Yuki Tanaka',
  'Isabella Garcia',
  'Marcus Johnson',
  'Chioma Okafor',
  'David Chen',
  'Amira Hassan',
  'James Thompson',
  'Lucia Rossi',
  'Hassan Ibrahim',
  'Sophie Laurent',
  'Anton Smirnov',
] as const;

const manualRollDatabase: Record<string, { name: string; srn: string }> = {
  FYA60: { name: 'Blessing Dube', srn: 'SRN2023060' },
  FYA61: { name: 'Tapiwa Chuma', srn: 'SRN2023061' },
  FYA62: { name: 'Farai Mlambo', srn: 'SRN2023062' },
};

const fallbackManualNames = [
  'Ashley Moyo',
  'Brian Ncube',
  'Chipo Dlamini',
  'Daniel Mutsvairo',
  'Eunice Sithole',
  'Farai Chitongo',
  'Grace Chari',
  'Henry Mbewe',
  'Irene Mukwasha',
  'Jason Muzenda',
] as const;

function pickRandomIndices(total: number, count: number, exclude = new Set<number>()) {
  const candidates: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!exclude.has(i)) candidates.push(i);
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return new Set(candidates.slice(0, Math.min(count, candidates.length)));
}

export function lookupManualStudentByRoll(rollNumber: string) {
  const normalizedRoll = rollNumber.trim().toUpperCase();
  const directMatch = manualRollDatabase[normalizedRoll];
  if (directMatch) return directMatch;

  const rollDigitsMatch = normalizedRoll.match(/\d+/);
  const numericPart = rollDigitsMatch ? parseInt(rollDigitsMatch[0], 10) : 0;
  const nameIndex = numericPart % fallbackManualNames.length;

  return {
    name: fallbackManualNames[nameIndex],
    srn: `SRN2023${String(Math.max(numericPart, 1)).padStart(3, '0')}`,
  };
}

export function generateStudents(): Student[] {
  return identifiedNames.map((name, i) => ({
    id: `identified-${i + 1}`,
    name,
    rollNumber: `FYA${String(i + 1).padStart(2, '0')}`,
    srn: `SRN2023${String(i + 1).padStart(3, '0')}`,
    confidence: 85 + Math.floor(Math.random() * 15),
    isIdentified: true,
    deskIndex: i,
    status: 'neutral' as const,
  }));
}

export function generateDesks(students: Student[]): Desk[] {
  const rows = DESK_ROWS;
  const cols = DESK_COLS;
  const desks: Desk[] = [];
  // Keep exactly these seats unidentified: 12, 22, 27 (1-based seat positions).
  const unidentifiedSeatPositions = new Set(FIXED_UNIDENTIFIED_SEAT_POSITIONS);
  // Keep 3 absences random, but never override fixed unidentified seats.
  const absentSeatPositions = pickRandomIndices(TOTAL_SEATS, ABSENT_SEATS_COUNT, unidentifiedSeatPositions);
  let identifiedIdx = 0;
  let unknownIdx = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const deskStudents: Student[] = [];

      for (let seat = 0; seat < SEATS_PER_DESK; seat++) {
        const seatPosition = idx * SEATS_PER_DESK + seat;

        if (absentSeatPositions.has(seatPosition)) {
          continue;
        }

        if (unidentifiedSeatPositions.has(seatPosition)) {
          deskStudents.push({
            id: `unknown-${unknownIdx}`,
            name: 'Unknown',
            rollNumber: '',
            srn: '',
            confidence: 0,
            isIdentified: false,
            deskIndex: seatPosition,
            status: 'neutral',
          });
          unknownIdx++;
        } else {
          const base = students[identifiedIdx % students.length];
          deskStudents.push({
            ...base,
            id: `${base.id}-seat-${seatPosition}`,
            deskIndex: seatPosition,
            status: 'neutral',
          });
          identifiedIdx++;
        }
      }

      desks.push({
        id: `desk-${idx}`,
        row: r,
        col: c,
        occupied: deskStudents.length > 0,
        students: deskStudents,
      });
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
