// All values are fictional demo data for the BUD Digital Campus concept presentation.

export const SEMESTER = 'Fall 2026'
export const TODAY = 'Sunday, 13 September 2026'
export const TODAY_SHORT = 'Sun, 13 Sep'

export const student = {
  name: 'Maya Haddad',
  first: 'Maya',
  initials: 'MH',
  id: 'BUD-2024-0187',
  program: 'Software Engineering',
  faculty: 'Faculty of Engineering & IT',
  year: 'Year 3',
  gpa: 3.62,
  creditsEarned: 78,
  creditsRequired: 132,
  advisor: 'Dr. Lina Saleh',
  email: 'maya.haddad@students.bud.demo',
}

export type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu'
export const DAYS: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']

export interface Course {
  code: string
  title: string
  credits: number
  section: string
  days: Day[]
  start: string
  end: string
  room: string
  building: string
  instructor: string
}

export const baseCourses: Course[] = [
  {
    code: 'CS310',
    title: 'Operating Systems',
    credits: 3,
    section: 'A',
    days: ['Sun', 'Tue'],
    start: '08:30',
    end: '10:00',
    room: 'E-201',
    building: 'Engineering',
    instructor: 'Dr. Rami Khoury',
  },
  {
    code: 'MATH302',
    title: 'Probability & Statistics',
    credits: 3,
    section: 'B',
    days: ['Sun', 'Thu'],
    start: '10:00',
    end: '11:30',
    room: 'B-105',
    building: 'Science',
    instructor: 'Dr. Hala Mansour',
  },
  {
    code: 'CS305',
    title: 'Software Architecture',
    credits: 3,
    section: 'A',
    days: ['Mon', 'Wed'],
    start: '10:00',
    end: '11:30',
    room: 'E-110',
    building: 'Engineering',
    instructor: 'Dr. Lina Saleh',
  },
  {
    code: 'ENG301',
    title: 'Technical Writing',
    credits: 3,
    section: 'C',
    days: ['Mon', 'Wed'],
    start: '13:00',
    end: '14:30',
    room: 'H-012',
    building: 'Humanities',
    instructor: 'Ms. Dana Aziz',
  },
]

export const cs301 = {
  code: 'CS301',
  title: 'Database Systems',
  credits: 3,
  prerequisite: 'CS201 Data Structures',
  prerequisiteMet: true,
  instructor: 'Dr. Omar Nasser',
  sections: {
    A: {
      section: 'A',
      days: ['Mon', 'Wed'] as Day[],
      start: '10:00',
      end: '11:30',
      room: 'E-118',
      seats: 4,
      capacity: 40,
    },
    B: {
      section: 'B',
      days: ['Tue', 'Thu'] as Day[],
      start: '12:00',
      end: '13:30',
      room: 'E-204',
      seats: 11,
      capacity: 40,
    },
  },
}

export const cs301Course: Course = {
  code: cs301.code,
  title: cs301.title,
  credits: 3,
  section: 'B',
  days: cs301.sections.B.days,
  start: cs301.sections.B.start,
  end: cs301.sections.B.end,
  room: cs301.sections.B.room,
  building: 'Engineering',
  instructor: cs301.instructor,
}

export const otherOfferings = [
  { code: 'CS320', title: 'Computer Networks', credits: 3, slot: 'Sun/Tue 12:00–13:30', seats: 0 },
  { code: 'CS330', title: 'Human–Computer Interaction', credits: 3, slot: 'Thu 14:00–17:00', seats: 7 },
]

export const finance = {
  ratePerCredit: 100,
  servicesFee: 100,
  paid: 800,
  dueDate: '1 Oct 2026',
  payments: [
    { date: '28 Aug 2026', method: 'Bank transfer', ref: 'PAY-55102', amount: 500 },
    { date: '3 Sep 2026', method: 'Cashier desk', ref: 'PAY-55871', amount: 300 },
  ],
}

export function invoiceFor(credits: number) {
  const tuition = credits * finance.ratePerCredit
  const total = tuition + finance.servicesFee
  return { credits, tuition, total, paid: finance.paid, balance: total - finance.paid }
}

export const decision = {
  id: 'DEC-2026-014',
  title: 'Amendment to the Fall 2026 Academic Calendar',
  summary:
    'Mid-semester break moves to 25–29 October 2026. Final examinations start 4 January 2027. Add/drop window extended to 20 September.',
  issuedBy: 'Office of the President',
  audience: ['All students', 'Academic staff', 'Administrative staff'],
  reach: 7180,
  attachments: [
    { name: 'Fall-2026-calendar-amended.pdf', size: '412 KB' },
    { name: 'Council-minutes-09-2026.pdf', size: '186 KB' },
  ],
}

export const transport = {
  line: 'Mezzeh Line 3',
  lineShort: 'L3',
  stop: 'Mezzeh Highway — Stop 4',
  bus: 'Bus 12',
  plate: 'DMS 41-2290',
  driver: 'Khaled M.',
  oldTime: '07:15',
  newTime: '07:00',
  arrival: '07:55',
  subscription: 'Semester pass · Fall 2026',
  validUntil: '15 Jan 2027',
}

export const grade = { course: 'CS301', assessment: 'Midterm exam', weight: '30%', maya: 87, letter: 'A−' }
