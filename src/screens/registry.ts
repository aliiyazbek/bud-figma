import type { ComponentType } from 'react'
import type { ScreenCode } from '../state/NavContext'
import { screenReqs, type Req } from '../data/requirements'
export type { Req }
import W01 from './web/W01'
import W02 from './web/W02'
import W03 from './web/W03'
import W04 from './web/W04'
import W05 from './web/W05'
import W06 from './web/W06'
import W07 from './web/W07'
import W08 from './web/W08'
import W09 from './web/W09'
import W10 from './web/W10'
import W11 from './web/W11'
import M01 from './mobile/M01'
import M02 from './mobile/M02'
import M03 from './mobile/M03'
import M04 from './mobile/M04'
import M05 from './mobile/M05'
import M06 from './mobile/M06'
import M07 from './mobile/M07'
import M08 from './mobile/M08'
import M09 from './mobile/M09'
import M10 from './mobile/M10'
import M11 from './mobile/M11'

export interface ScreenDef {
  code: ScreenCode
  name: string
  kind: 'web' | 'mobile'
  audience: string
  Component: ComponentType
  /** One-line statement of what the screen demonstrates. */
  purpose: string
  /** Functional requirements from the proposal (Appendix A) expressed by this screen. */
  reqs: Req[]
}

const base: Omit<ScreenDef, 'purpose' | 'reqs'>[] = [
  { code: 'W01', name: 'Executive Overview', kind: 'web', audience: 'President', Component: W01 },
  { code: 'W02', name: 'Decisions & Approvals', kind: 'web', audience: 'President', Component: W02 },
  { code: 'W03', name: 'Faculty Operations', kind: 'web', audience: 'Dean', Component: W03 },
  { code: 'W04', name: 'Student 360', kind: 'web', audience: 'Student Affairs', Component: W04 },
  { code: 'W05', name: 'Grade Approval', kind: 'web', audience: 'Dean', Component: W05 },
  { code: 'W06', name: 'Transport Operations', kind: 'web', audience: 'Transport', Component: W06 },
  { code: 'W07', name: 'Finance Overview', kind: 'web', audience: 'Finance', Component: W07 },
  { code: 'W08', name: 'Staff Inbox', kind: 'web', audience: 'Staff', Component: W08 },
  { code: 'W09', name: 'File Review', kind: 'web', audience: 'Staff', Component: W09 },
  { code: 'W10', name: 'Workflow Routing', kind: 'web', audience: 'Staff', Component: W10 },
  { code: 'W11', name: 'Professor Schedule', kind: 'web', audience: 'Faculty', Component: W11 },
  { code: 'M01', name: 'Student Home', kind: 'mobile', audience: 'Student', Component: M01 },
  { code: 'M02', name: 'Course Registration', kind: 'mobile', audience: 'Student', Component: M02 },
  { code: 'M03', name: 'Weekly Schedule', kind: 'mobile', audience: 'Student', Component: M03 },
  { code: 'M04', name: 'Campus Map', kind: 'mobile', audience: 'Student', Component: M04 },
  { code: 'M05', name: 'My Transport', kind: 'mobile', audience: 'Student', Component: M05 },
  { code: 'M06', name: 'Fees & Invoices', kind: 'mobile', audience: 'Student', Component: M06 },
  { code: 'M07', name: 'Academic Results', kind: 'mobile', audience: 'Student', Component: M07 },
  { code: 'M08', name: 'Documents & Requests', kind: 'mobile', audience: 'Student', Component: M08 },
  { code: 'M09', name: 'Events & Activities', kind: 'mobile', audience: 'Student', Component: M09 },
  { code: 'M10', name: 'Library', kind: 'mobile', audience: 'Student', Component: M10 },
  { code: 'M11', name: 'Career Opportunities', kind: 'mobile', audience: 'Student', Component: M11 },
]

export const screens: ScreenDef[] = base.map((s) => ({ ...s, ...screenReqs[s.code] }))

export const screenByCode = Object.fromEntries(screens.map((s) => [s.code, s])) as Record<ScreenCode, ScreenDef>
export const isScreenCode = (v: string | null): v is ScreenCode => !!v && v in screenByCode
