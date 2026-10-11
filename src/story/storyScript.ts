import type { DemoAction } from '../state/DemoContext'
import type { ScreenCode } from '../state/NavContext'

export interface Beat {
  at: number
  highlight?: string
  action?: DemoAction
}
export interface StoryStep {
  screen: ScreenCode
  caption: string
  duration: number
  beats?: Beat[]
}

export const storyScript: StoryStep[] = [
  { screen: 'W01', caption: 'One connected platform — the whole university at a glance.', duration: 5000, beats: [{ at: 1400, highlight: 'kpis' }] },
  { screen: 'M01', caption: 'Maya opens the BUD student app.', duration: 4000, beats: [{ at: 1400, highlight: 'next-class' }] },
  {
    screen: 'M02',
    caption: 'She adds CS301 — a time conflict is detected instantly.',
    duration: 4500,
    beats: [
      { at: 1000, highlight: 'cs301-a' },
      { at: 1600, action: { type: 'selectConflict' } },
      { at: 2500, highlight: 'conflict' },
    ],
  },
  {
    screen: 'M02',
    caption: 'The system suggests Section B. One tap to confirm.',
    duration: 4500,
    beats: [
      { at: 500, highlight: 'cs301-b' },
      { at: 1000, action: { type: 'selectAlternative' } },
      { at: 2100, highlight: 'confirm-reg' },
      { at: 2700, action: { type: 'confirmRegistration' } },
    ],
  },
  { screen: 'M03', caption: 'Her weekly schedule updates automatically.', duration: 3500, beats: [{ at: 1100, highlight: 'cs301-slot' }] },
  { screen: 'M06', caption: 'Fees recalculate in real time: $1,600 total, $800 due.', duration: 4000, beats: [{ at: 700, highlight: 'balance' }] },
  { screen: 'W07', caption: 'Finance sees the same invoice — no re-entry, no delay.', duration: 3800, beats: [{ at: 900, highlight: 'maya-invoice' }] },
  {
    screen: 'W05',
    caption: 'The Dean approves CS301 midterm grades.',
    duration: 5500,
    beats: [
      { at: 1000, highlight: 'approve-grades' },
      { at: 1500, action: { type: 'openDialog', dialog: 'grades' } },
      { at: 2700, highlight: 'confirm-grades' },
      { at: 3300, action: { type: 'approveGrades' } },
    ],
  },
  { screen: 'M01', caption: 'Maya is notified the moment results are published.', duration: 4000, beats: [{ at: 1300, highlight: 'banner' }] },
  { screen: 'M07', caption: 'Only published results are visible: 87 / 100.', duration: 3500, beats: [{ at: 900, highlight: 'cs301-grade' }] },
  {
    screen: 'M08',
    caption: 'She requests an academic transcript — no queue, no paperwork.',
    duration: 6800,
    beats: [
      { at: 800, highlight: 'request-transcript' },
      { at: 1300, action: { type: 'requestTranscript' } },
      { at: 2600, highlight: 'simulate' },
      { at: 3100, action: { type: 'markTranscriptReady' } },
      { at: 4100, highlight: 'preview-transcript' },
      { at: 4600, action: { type: 'openDialog', dialog: 'transcript' } },
    ],
  },
  {
    screen: 'W02',
    caption: 'The President signs a decision — published to every portal at once.',
    duration: 5200,
    beats: [
      { at: 1000, highlight: 'publish-decision' },
      { at: 1500, action: { type: 'openDialog', dialog: 'decision' } },
      { at: 2700, highlight: 'confirm-decision' },
      { at: 3300, action: { type: 'publishDecision' } },
    ],
  },
  { screen: 'M01', caption: 'Students receive the official announcement immediately.', duration: 4000, beats: [{ at: 1300, highlight: 'banner' }] },
  {
    screen: 'W06',
    caption: 'Transport moves a morning trip 15 minutes earlier.',
    duration: 5200,
    beats: [
      { at: 1000, highlight: 'reschedule' },
      { at: 1500, action: { type: 'openDialog', dialog: 'trip' } },
      { at: 2700, highlight: 'confirm-trip' },
      { at: 3300, action: { type: 'rescheduleTrip' } },
    ],
  },
  { screen: 'M05', caption: 'Every subscribed rider sees the new time: 07:00.', duration: 4000, beats: [{ at: 900, highlight: 'trip-change' }] },
  { screen: 'W04', caption: 'Student 360 — every action, one unified record.', duration: 5000, beats: [{ at: 1000, highlight: 'w04-timeline' }] },
  { screen: 'W01', caption: 'BUD Digital Campus — connected, transparent, ready.', duration: 4500, beats: [{ at: 1200, highlight: 'decisions-list' }] },
]

export const storyTotal = storyScript.reduce((n, s) => n + s.duration, 0)
