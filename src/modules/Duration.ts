import * as matching from "./Matching"
import * as identity from "./Identity"
import * as string from "./String"
import * as readonlyArray from "./ReadonlyArray"
import * as readonlyRecord from "./ReadonlyRecord"
import { flow, pipe } from "../utils/flow"
import { isObject, isString } from "../utils/typeChecks"

export interface Duration {
  readonly years?: number
  readonly y?: number

  readonly months?: number
  readonly mn?: number

  readonly weeks?: number
  readonly w?: number

  readonly days?: number
  readonly d?: number

  readonly hours?: number
  readonly h?: number

  readonly minutes?: number
  readonly m?: number

  readonly seconds?: number
  readonly s?: number

  readonly milliseconds?: number
  readonly ms?: number
}

type DurationTemplateMilliseconds = `${number} milliseconds`
type DurationTemplateSeconds =
  | `${number} seconds${"" | DurationTemplateMilliseconds}`
  | DurationTemplateMilliseconds
type DurationTemplateMinutes =
  | `${number} minutes${"" | DurationTemplateSeconds}`
  | DurationTemplateSeconds
type DurationTemplateHours =
  | `${number} hours${"" | DurationTemplateMinutes}`
  | DurationTemplateMinutes
type DurationTemplateDays =
  | `${number} days${"" | DurationTemplateHours}`
  | DurationTemplateHours
type DurationTemplateWeeks =
  | `${number} weeks${"" | DurationTemplateDays}`
  | DurationTemplateDays
type DurationTemplateMonths =
  | `${number} months${"" | DurationTemplateWeeks}`
  | DurationTemplateWeeks
type DurationTemplateYears =
  | `${number} years${"" | DurationTemplateMonths}`
  | DurationTemplateMonths
export type DurationTemplate =
  | DurationTemplateMilliseconds
  | DurationTemplateSeconds
  | DurationTemplateMinutes
  | DurationTemplateHours
  | DurationTemplateDays
  | DurationTemplateWeeks
  | DurationTemplateMonths
  | DurationTemplateYears

export type DurationInput = Duration | DurationTemplate

export const fromTemplate: {
  (template: DurationTemplate): Duration
} = flow (
  string.split (" "),
  readonlyArray.chunksOf (2),
  readonlyArray.map (([value, unit]) => [unit, Number (value)]),
  readonlyRecord.fromEntries,
)

export const duration: {
  (input: DurationInput): Duration
} = flow (
  matching.match,
  matching.on (isObject, identity.identity<Duration>),
  matching.on (isString, fromTemplate),
  matching.getOrElse (() => ({ milliseconds: 0 })),
)

export const fromDate: {
  (date: Date): Duration
} = date => ({ milliseconds: date.valueOf () })

export const fromMilliseconds: {
  (milliseconds: number): Duration
} = milliseconds => ({ milliseconds })

const millisecondsFromSeconds: {
  (seconds: number): number
} = seconds => seconds * 1000

const millisecondsFromMinutes: {
  (minutes: number): number
} = minutes => millisecondsFromSeconds (minutes * 60)

const millisecondsFromHours: {
  (hours: number): number
} = hours => millisecondsFromMinutes (hours * 60)

const millisecondsFromDays: {
  (days: number): number
} = days => millisecondsFromHours (days * 24)

const millisecondsFromWeeks: {
  (weeks: number): number
} = weeks => millisecondsFromDays (weeks * 7)

const millisecondsFromMonths: {
  (months: number): number
} = months => millisecondsFromDays (months * 30)

const millisecondsFromYears: {
  (years: number): number
} = years => millisecondsFromDays (years * 365)

export const toMilliseconds: {
  (duration: Duration): number
} = duration =>
  pipe (
    identity.Do,
    identity.apS ("years", duration.years ?? duration.years ?? 0),
    identity.apS ("months", duration.months ?? duration.mn ?? 0),
    identity.apS ("weeks", duration.weeks ?? duration.w ?? 0),
    identity.apS ("days", duration.days ?? duration.d ?? 0),
    identity.apS ("hours", duration.hours ?? duration.h ?? 0),
    identity.apS ("minutes", duration.minutes ?? duration.m ?? 0),
    identity.apS ("seconds", duration.seconds ?? duration.s ?? 0),
    identity.apS ("milliseconds", duration.milliseconds ?? duration.ms ?? 0),
    identity.map (
      ({ milliseconds, seconds, minutes, hours, days, weeks, months, years }) =>
        milliseconds +
        millisecondsFromSeconds (seconds) +
        millisecondsFromMinutes (minutes) +
        millisecondsFromHours (hours) +
        millisecondsFromDays (days) +
        millisecondsFromWeeks (weeks) +
        millisecondsFromMonths (months) +
        millisecondsFromYears (years),
    ),
  )
