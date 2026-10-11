export interface Req {
  id: string
  title: string
}

const r = (...pairs: [string, string][]): Req[] => pairs.map(([id, title]) => ({ id, title }))

export const screenReqs: Record<string, { purpose: string; reqs: Req[] }> = {
  W01: {
    purpose: 'A single command view for the President: live KPIs, faculty performance, collections and the decisions awaiting signature.',
    reqs: r(['FR-RPT-01', 'Executive KPI dashboard'], ['FR-GOV-01', 'Numbered decisions awaiting signature'], ['FR-FIN-11', 'Financial collection reports'], ['FR-AUTH-09', 'Presidency portal with portal switching']),
  },
  W02: {
    purpose: 'Presidential decisions and faculty requests move through a documented, traceable approval path.',
    reqs: r(['FR-GOV-01', 'Issue numbered decisions & circulars'], ['FR-GOV-10', 'Documented approval path to Presidency'], ['FR-GOV-02', 'Target audience and recipients'], ['FR-COM-02', 'Instant multi-channel delivery'], ['FR-GOV-04', 'Decision queue filters and lookup']),
  },
  W03: {
    purpose: "A dean's operational picture: section capacity, academic requests and grade performance in one place.",
    reqs: r(['FR-REG-01', 'Course sections and capacity'], ['FR-RPT-02', 'Academic reports'], ['FR-GRD-02', 'Document requests with status'], ['FR-REG-05', 'Section change and withdrawal requests'], ['FR-AUTH-04', 'Faculty-scoped permissions']),
  },
  W04: {
    purpose: 'One unified student record, with status, study-plan progress, documents and finance visible to Student Affairs.',
    reqs: r(['FR-STU-01', 'Unified student profile'], ['FR-FIN-07', 'Student account statement'], ['FR-GRD-04', 'Degree audit against study plan'], ['FR-STU-03', 'Student status and standing'], ['FR-GRD-02', 'Document request status tracking'], ['FR-FIN-02', 'Invoice updated from registration']),
  },
  W05: {
    purpose: 'Grades travel lecturer → head → dean before release, then lock automatically.',
    reqs: r(['FR-EXM-05', 'Multi-step grade approval'], ['FR-EXM-06', 'Lock grades after approval'], ['FR-RPT-02', 'Course grade distribution and pass rate'], ['FR-COM-02', 'Instant notification on release'], ['FR-EXM-07', 'Automatic letter-grade calculation']),
  },
  W06: {
    purpose: "Lines, stops, today's trips and occupancy for the Transport Office, with rescheduling that notifies riders.",
    reqs: r(['FR-TRN-09', 'Subscriber notifications'], ['FR-TRN-03', 'Routes and stops'], ['FR-TRN-12', 'Transport reports'], ['FR-TRN-01', 'Fleet availability summary']),
  },
  W07: {
    purpose: 'Billing, collections and outstanding balances across faculties for the Finance Office.',
    reqs: r(['FR-FIN-02', 'Automatic semester invoices'], ['FR-FIN-11', 'Financial reports'], ['FR-FIN-07', 'Student account statement'], ['FR-FIN-05', 'Recorded cashier and bank payments']),
  },
  M01: {
    purpose: "Maya's day at a glance: next class, alerts and every campus service one tap away.",
    reqs: r(['FR-COM-02', 'Push notifications'], ['FR-SCH-04', 'Next lecture from personal timetable'], ['FR-COM-01', 'Targeted announcements'], ['FR-MAP-04', 'Next lecture linked to map']),
  },
  M02: {
    purpose: 'Self-registration with live checks for prerequisites, load limits, clashes and capacity.',
    reqs: r(['FR-REG-03', 'Self-registration with automatic checks'], ['FR-REG-02', 'Only eligible courses shown'], ['FR-FIN-02', 'Invoice updates on add/drop'], ['FR-REG-05', 'Add/drop within calendar window']),
  },
  M03: {
    purpose: 'The weekly timetable and day agenda, with directions from every lecture to the campus map.',
    reqs: r(['FR-SCH-04', 'Personal timetable on mobile'], ['FR-MAP-04', 'Timetable linked to map']),
  },
  M04: {
    purpose: 'Phase-1 campus map for Ghabageb: verified directory of faculties and services, honest about unsurveyed positions.',
    reqs: r(['FR-MAP-01', 'Schematic 2D campus diagram'], ['FR-MAP-03', 'Search faculties, buildings & rooms'], ['FR-SRV-02', 'Campus facilities directory'], ['FR-MAP-05', 'Walking route (demo preview)']),
  },
  M05: {
    purpose: 'Bus subscription, QR boarding pass, stop times and schedule-change alerts for the student.',
    reqs: r(['FR-TRN-03', 'Line stops & scheduled times'], ['FR-TRN-09', 'Trip change alerts'], ['FR-TRN-04', 'Semester line subscription'], ['FR-TRN-05', 'QR boarding pass']),
  },
  M06: {
    purpose: 'Transparent fees: an invoice built from registered credit hours, payments made and the balance due.',
    reqs: r(['FR-FIN-02', 'Invoice recalculated from credit hours'], ['FR-FIN-07', 'Account statement'], ['FR-FIN-05', 'Payments & numbered receipts']),
  },
  M07: {
    purpose: 'Published results only, with GPA, credits earned and progress through the study plan.',
    reqs: r(['FR-EXM-09', 'View grades & plan progress'], ['FR-EXM-05', 'Only approved grades shown'], ['FR-EXM-07', 'GPA & credit calculation'], ['FR-EXM-08', 'Academic standing']),
  },
  M08: {
    purpose: 'Request official documents online and track each request until the transcript is ready to preview.',
    reqs: r(['FR-GRD-02', 'Online document requests & tracking'], ['FR-GRD-01', 'Official transcript preview']),
  },
  M09: {
    purpose: 'Discover campus events by type, book a seat within capacity and set reminders.',
    reqs: r(['FR-EVT-03', 'Events calendar & type filter'], ['FR-EVT-04', 'Seat booking within capacity'], ['FR-EVT-08', 'Event reminders'], ['FR-JOB-09', 'Career workshops as campus events']),
  },
  M10: {
    purpose: 'Search the catalogue, reserve or wait-list titles and keep an eye on loan due dates.',
    reqs: r(['FR-LIB-02', 'Catalogue search'], ['FR-LIB-05', 'Holds, waitlist & availability alert'], ['FR-LIB-01', 'Catalogue record, shelf & copies'], ['FR-LIB-14', 'Due-soon loan alert']),
  },
  M11: {
    purpose: "Internships and jobs matched to the student's major and year, with one-tap applications.",
    reqs: r(['FR-JOB-05', 'Automatic job matching'], ['FR-JOB-04', 'Apply to opportunities from phone'], ['FR-JOB-03', 'Jobs & internships with deadlines'], ['FR-JOB-08', 'On-campus university vacancies']),
  },
}

