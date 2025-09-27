import * as Record from '../ReadonlyRecord'

export const durationUnitsFull = [
  'milliseconds',
  'seconds',
  'minutes',
  'hours',
  'days',
  'months',
  'years',
] as const
export const durationUnitsShort = ['ms', 's', 'm', 'h', 'd', 'mn', 'y'] as const
export const durationUnits = [
  ...durationUnitsFull,
  ...durationUnitsShort,
] as const

type DurationUnit = (typeof durationUnits)[number]

export type Duration = Partial<Record.ReadonlyRecord<DurationUnit, number>>

// NOTICE: too detailed template typization leads to performance issues
/* type DurationTemplateMilliseconds = `${number} ${"milliseconds" | "ms"}`
type DurationTemplateSeconds =
  | `${number} ${"seconds" | "s"}${"" | ` ${DurationTemplateMilliseconds}`}`
  | DurationTemplateMilliseconds
type DurationTemplateMinutes =
  | `${number} ${"minutes" | "m"}${"" | ` ${DurationTemplateSeconds}`}`
  | DurationTemplateSeconds
type DurationTemplateHours =
  | `${number} ${"hours" | "h"}${"" | ` ${DurationTemplateMinutes}`}`
  | DurationTemplateMinutes
type DurationTemplateDays =
  | `${number} ${"days" | "d"}${"" | ` ${DurationTemplateHours}`}`
  | DurationTemplateHours
type DurationTemplateWeeks =
  | `${number} ${"weeks" | "w"}${"" | ` ${DurationTemplateDays}`}`
  | DurationTemplateDays
type DurationTemplateMonths =
  | `${number} ${"months" | "mn"}${"" | ` ${DurationTemplateWeeks}`}`
  | DurationTemplateWeeks
type DurationTemplateYears =
  | `${number} ${"years" | "y"}${"" | ` ${DurationTemplateMonths}`}`
  | DurationTemplateMonths
export type DurationTemplate =
  | DurationTemplateMilliseconds
  | DurationTemplateSeconds
  | DurationTemplateMinutes
  | DurationTemplateHours
  | DurationTemplateDays
  | DurationTemplateWeeks
  | DurationTemplateMonths
  | DurationTemplateYears */

export type DurationInput = Duration | string | number
