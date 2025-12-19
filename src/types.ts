
export type EventType = 'THERMAL' | 'OVER_VOLTAGE' | 'UNDER_VOLTAGE' | 'OVER_CURRENT'
export type Severity = 'WARNING' | 'CRITICAL'

export interface SafetyEvent {
  id: string
  type: EventType
  severity: Severity
  timestamp: string
  description: string
  actionTaken: string
}
