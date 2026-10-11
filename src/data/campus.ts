// Campus directory for BUD, built only from verified public sources
// (see BUD Campus Map designer brief, 11 Oct 2026). Positions inside the
// campus are NOT surveyed, so no place here carries map coordinates.

export type PlaceKind = 'faculty' | 'institute' | 'building' | 'service' | 'library' | 'labs' | 'transport' | 'sports'
export type Confidence = 'verified' | 'named' | 'exists' | 'historical'

export interface Place {
  id: string
  en: string
  ar: string
  kind: PlaceKind
  confidence: Confidence
  summary: string
  programmes?: string[]
  services?: string[]
  room?: string
  /** related app screen */
  link?: { label: string; code: 'M05' | 'M06' | 'M10' | 'M02' }
}

export const CAMPUS = {
  en: 'BUD Campus',
  ar: 'خريطة الجامعة',
  place: 'Ghabageb, Daraa Governorate',
  road: 'Damascus–Daraa highway',
  lat: 33.17285,
  lng: 36.29514,
  area: '≈ 257,000 m² (historical figure)',
  email: 'info@bud.edu.sy',
  phone: '+963 11 331 1710',
  web: 'https://bud.edu.sy',
  maps: 'https://www.google.com/maps/@33.17285,36.29514,18z/data=!3m1!1e3',
}

export const places: Place[] = [
  { id: 'pharm-bld', en: 'Pharmacy Building', ar: 'بناء الصيدلة', kind: 'building', confidence: 'named', summary: 'Academic building', services: ['Finance Office · Room 123'] },
  { id: 'finance', en: 'Finance Office', ar: 'مكتب المالية', kind: 'service', confidence: 'verified', room: 'Room 123 · Pharmacy Building', summary: 'Tuition payments and invoices', link: { label: 'Open Fees & Invoices', code: 'M06' } },
  { id: 'library', en: 'Library', ar: 'المكتبة', kind: 'library', confidence: 'exists', summary: 'Reading halls and catalogue', link: { label: 'Open Library', code: 'M10' } },
  { id: 'labs', en: 'Science Labs', ar: 'المخابر العلمية', kind: 'labs', confidence: 'exists', summary: 'Teaching laboratories, incl. microscope lab' },
  { id: 'buses', en: 'University Buses', ar: 'باصات الجامعة', kind: 'transport', confidence: 'exists', summary: 'Lines from Damascus-area districts to campus', link: { label: 'Open My Transport', code: 'M05' } },
  { id: 'sports', en: 'Sports Facilities', ar: 'المرافق الرياضية', kind: 'sports', confidence: 'historical', summary: 'Football field mentioned in earlier reports' },
  { id: 'student-svc', en: 'Student Services', ar: 'شؤون الطلاب', kind: 'service', confidence: 'exists', summary: 'Registration, documents and student affairs' },
  { id: 'f-dent', en: 'Faculty of Dentistry', ar: 'كلية طب الأسنان', kind: 'faculty', confidence: 'verified', summary: 'Medical · Dental', programmes: ['Dental Surgery'] },
  { id: 'f-pharm', en: 'Faculty of Pharmacy', ar: 'كلية الصيدلة', kind: 'faculty', confidence: 'verified', summary: 'Medical · Pharmacy', programmes: ['Pharmacy'] },
  { id: 'f-med', en: 'Faculty of Medical Sciences', ar: 'كلية العلوم الطبية', kind: 'faculty', confidence: 'verified', summary: 'Medical', programmes: ['Physiotherapy'] },
  { id: 'f-eng', en: 'Faculty of Engineering', ar: 'كلية الهندسة', kind: 'faculty', confidence: 'verified', summary: 'Engineering', programmes: ['Information Technology Engineering', 'Mechatronics Engineering', 'Telecommunication Engineering'], link: { label: 'Open Course Registration', code: 'M02' } },
  { id: 'f-arch', en: 'Faculty of Architecture', ar: 'كلية الهندسة المعمارية', kind: 'faculty', confidence: 'verified', summary: 'Engineering & Design', programmes: ['Architecture'] },
  { id: 'f-law', en: 'Faculty of Law', ar: 'كلية الحقوق', kind: 'faculty', confidence: 'verified', summary: 'Law', programmes: ['Law'] },
  { id: 'f-mgmt', en: 'Faculty of Management Sciences', ar: 'كلية علوم الإدارة', kind: 'faculty', confidence: 'verified', summary: 'Business', programmes: ['Business Administration', 'Finance and Banking', 'Accounting'] },
  { id: 'inst-dent', en: 'Technical Institute of Dentistry', ar: 'المعهد التقاني للتعويضات السنية', kind: 'institute', confidence: 'verified', summary: 'Dental technology', programmes: ['Dental Technology'] },
]

export const confidenceMeta: Record<Confidence, { en: string; ar: string; tone: 'success' | 'info' | 'warning' | 'neutral' }> = {
  verified: { en: 'Officially listed · location pending', ar: 'مُعتمد رسمياً · الموقع بانتظار التحقق', tone: 'info' },
  named: { en: 'Name verified · position pending', ar: 'الاسم مؤكد · الموقع بانتظار التحقق', tone: 'info' },
  exists: { en: 'Exists · location not yet mapped', ar: 'موجود · لم يُحدَّد الموقع بعد', tone: 'warning' },
  historical: { en: 'Historical · to be verified', ar: 'معلومة سابقة · بانتظار التحقق', tone: 'neutral' },
}
