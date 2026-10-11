import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { baseCourses, cs301Course, invoiceFor, transport, decision, grade } from '../data/demo'

export type DialogId = 'grades' | 'decision' | 'trip' | 'transcript' | null
export type TranscriptStatus = 'none' | 'processing' | 'ready'
export type LogKind =
  | 'registration'
  | 'invoice'
  | 'grades'
  | 'transcript-requested'
  | 'transcript-ready'
  | 'decision'
  | 'trip'

export interface Notice {
  id: string
  kind: 'result' | 'decision' | 'transport' | 'document' | 'finance'
  title: string
  body: string
  time: string
}

export interface DemoState {
  cs301Section: 'A' | 'B' | null
  registrationConfirmed: boolean
  gradesPublished: boolean
  transcript: TranscriptStatus
  decisionPublished: boolean
  tripRescheduled: boolean
  eventBooked: boolean
  bookReserved: boolean
  jobSaved: boolean
  jobApplied: boolean
  dialog: DialogId
  log: LogKind[]
  notices: Notice[]
  bannersShown: string[]
}

export type DemoAction =
  | { type: 'selectConflict' }
  | { type: 'selectAlternative' }
  | { type: 'clearSelection' }
  | { type: 'confirmRegistration' }
  | { type: 'approveGrades' }
  | { type: 'requestTranscript' }
  | { type: 'markTranscriptReady' }
  | { type: 'publishDecision' }
  | { type: 'rescheduleTrip' }
  | { type: 'bookEvent' }
  | { type: 'reserveBook' }
  | { type: 'toggleSaveJob' }
  | { type: 'applyJob' }
  | { type: 'openDialog'; dialog: Exclude<DialogId, null> }
  | { type: 'closeDialog' }
  | { type: 'bannerShown'; id: string }
  | { type: 'markAllBannersShown' }
  | { type: 'reset' }

export const initialState: DemoState = {
  cs301Section: null,
  registrationConfirmed: false,
  gradesPublished: false,
  transcript: 'none',
  decisionPublished: false,
  tripRescheduled: false,
  eventBooked: false,
  bookReserved: false,
  jobSaved: false,
  jobApplied: false,
  dialog: null,
  log: [],
  notices: [],
  bannersShown: [],
}

const addLog = (s: DemoState, ...k: LogKind[]) => [...s.log, ...k.filter((x) => !s.log.includes(x))]
const addNotice = (s: DemoState, n: Notice) =>
  s.notices.some((x) => x.id === n.id) ? s.notices : [n, ...s.notices]

export function reducer(s: DemoState, a: DemoAction): DemoState {
  switch (a.type) {
    case 'selectConflict':
      return s.registrationConfirmed ? s : { ...s, cs301Section: 'A' }
    case 'selectAlternative':
      return s.registrationConfirmed ? s : { ...s, cs301Section: 'B' }
    case 'clearSelection':
      return s.registrationConfirmed ? s : { ...s, cs301Section: null }
    case 'confirmRegistration':
      if (s.registrationConfirmed || s.cs301Section !== 'B') return s
      return {
        ...s,
        registrationConfirmed: true,
        log: addLog(s, 'registration', 'invoice'),
        notices: addNotice(s, {
          id: 'n-invoice',
          kind: 'finance',
          title: 'Invoice updated',
          body: 'CS301 added · New total $1,600 · Balance $800',
          time: 'Just now',
        }),
        bannersShown: [...s.bannersShown, 'n-invoice'],
      }
    case 'approveGrades':
      if (s.gradesPublished) return { ...s, dialog: null }
      return {
        ...s,
        gradesPublished: true,
        dialog: null,
        log: addLog(s, 'grades'),
        notices: addNotice(s, {
          id: 'n-result',
          kind: 'result',
          title: 'New result published',
          body: `${grade.course} ${grade.assessment}: ${grade.maya} / 100`,
          time: 'Just now',
        }),
      }
    case 'requestTranscript':
      if (s.transcript !== 'none') return s
      return { ...s, transcript: 'processing', log: addLog(s, 'transcript-requested') }
    case 'markTranscriptReady':
      if (s.transcript !== 'processing') return s
      return {
        ...s,
        transcript: 'ready',
        log: addLog(s, 'transcript-ready'),
        notices: addNotice(s, {
          id: 'n-doc',
          kind: 'document',
          title: 'Transcript ready',
          body: 'Your academic transcript request DOC-3391 is ready.',
          time: 'Just now',
        }),
        bannersShown: [...s.bannersShown, 'n-doc'],
      }
    case 'publishDecision':
      if (s.decisionPublished) return { ...s, dialog: null }
      return {
        ...s,
        decisionPublished: true,
        dialog: null,
        log: addLog(s, 'decision'),
        notices: addNotice(s, {
          id: 'n-decision',
          kind: 'decision',
          title: `Official announcement · ${decision.id}`,
          body: decision.title,
          time: 'Just now',
        }),
      }
    case 'rescheduleTrip':
      if (s.tripRescheduled) return { ...s, dialog: null }
      return {
        ...s,
        tripRescheduled: true,
        dialog: null,
        log: addLog(s, 'trip'),
        notices: addNotice(s, {
          id: 'n-trip',
          kind: 'transport',
          title: `${transport.line} departs earlier`,
          body: `Pickup moves from ${transport.oldTime} to ${transport.newTime} starting tomorrow.`,
          time: 'Just now',
        }),
      }
    case 'bookEvent':
      return { ...s, eventBooked: true }
    case 'reserveBook':
      return { ...s, bookReserved: true }
    case 'toggleSaveJob':
      return { ...s, jobSaved: !s.jobSaved }
    case 'applyJob':
      return { ...s, jobApplied: true, jobSaved: true }
    case 'openDialog':
      return { ...s, dialog: a.dialog }
    case 'closeDialog':
      return { ...s, dialog: null }
    case 'bannerShown':
      return s.bannersShown.includes(a.id) ? s : { ...s, bannersShown: [...s.bannersShown, a.id] }
    case 'markAllBannersShown':
      return { ...s, bannersShown: s.notices.map((n) => n.id) }
    case 'reset':
      return initialState
  }
}

const Ctx = createContext<{ state: DemoState; dispatch: Dispatch<DemoAction> } | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useDemo() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useDemo must be used inside DemoProvider')
  return v
}

/** Derived, cross-screen values so web and mobile always agree. */
export function useDerived() {
  const { state } = useDemo()
  const courses = state.registrationConfirmed ? [...baseCourses, cs301Course] : baseCourses
  const credits = courses.reduce((n, c) => n + c.credits, 0)
  return {
    courses,
    credits,
    invoice: invoiceFor(credits),
    prevInvoice: invoiceFor(12),
    tripTime: state.tripRescheduled ? transport.newTime : transport.oldTime,
    pendingDecisions: state.decisionPublished ? 3 : 4,
  }
}
