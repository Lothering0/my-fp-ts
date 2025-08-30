import * as matching from "../Matching"
import * as identity from "../Identity"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import * as option from "../Option"
import * as result from "../Result"
import * as number from "../Number"
import * as string from "../String"
import * as boolean from "../Boolean"
import { flow, pipe } from "../../utils/flow"
import { isNumber, isObject, isString } from "../../utils/typeChecks"
import {
  Duration,
  durationUnits,
  DurationInput,
  durationUnitsFull,
  durationUnitsShort,
} from "./duration"
import { constant, constFalse } from "../../utils/constant"
import { empty } from "./monoid"

export const fromMilliseconds: {
  (milliseconds: number): Duration
} = milliseconds => ({ milliseconds })

export const fromSeconds: {
  (seconds: number): Duration
} = seconds => ({ seconds })

export const fromMinutes: {
  (minutes: number): Duration
} = minutes => ({ minutes })

export const fromHours: {
  (hours: number): Duration
} = hours => ({ hours })

export const fromDays: {
  (days: number): Duration
} = days => ({ days })

export const fromWeeks: {
  (weeks: number): Duration
} = weeks => ({ weeks })

export const fromMonths: {
  (months: number): Duration
} = months => ({ months })

export const fromYears: {
  (years: number): Duration
} = years => ({ years })

const arrayOption = option.transform (readonlyArray.Monad)

export const isTemplateValid: {
  (template: string): boolean
} = template =>
  pipe (
    durationUnitsFull,
    readonlyArray.reduce ("", (acc, unit, i) =>
      pipe (
        identity.Do,
        identity.apS ("shortUnit", durationUnitsShort[i]),
        identity.mapTo (
          "part",
          ({ shortUnit }) => `(\\d+ (${unit}|${shortUnit}))|(1 ${unit}?)`,
        ),
        identity.map (({ part }) => acc ? `(${part})? ?(${acc})?` : part),
      ),
    ),
    string.prepend ("^"),
    string.append ("$"),
    pattern => new RegExp (pattern),
    regExp =>
      pipe (
        template,
        string.trim,
        string.match (constFalse, trimmed => regExp.test (trimmed)),
      ),
  )

export class DurationTemplateParseError extends SyntaxError {
  constructor(message: string) {
    super (message)
    this.name = "DurationTemplateParseError"
  }
}

export const fromTemplate: {
  (template: string): result.Result<DurationTemplateParseError, Duration>
} = template =>
  pipe (
    template,
    isTemplateValid,
    boolean.match (
      () =>
        result.fail (
          new DurationTemplateParseError ("Invalid duration template"),
        ),
      () =>
        pipe (
          template.matchAll (/(-?\d+) +(\w+)/g),
          Array.from<ReadonlyArray<string>>,
          readonlyArray.map (readonlyArray.tail),
          arrayOption.map (([value, unit]) => [unit!, Number (value)] as const),
          readonlyArray.compact,
          readonlyArray.filter (([key]) =>
            pipe (durationUnits, readonlyArray.includes (key)),
          ),
          readonlyRecord.fromEntries,
          result.succeed,
        ),
    ),
  )

export const fromTemplateOrZero: {
  (template: string): Duration
} = flow (fromTemplate, result.getOrElse (constant (empty)))

export const make: {
  (input: DurationInput): Duration
} = flow (
  matching.match,
  matching.on (isObject, identity.identity<Duration>),
  matching.on (isString, fromTemplateOrZero),
  matching.on (isNumber, fromMilliseconds),
  matching.getOrElse (constant (empty)),
)

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

export const toSeconds: {
  (duration: Duration): number
} = flow (toMilliseconds, number.divide (1000))

export const toMinutes: {
  (duration: Duration): number
} = flow (toSeconds, number.divide (60))

export const toHours: {
  (duration: Duration): number
} = flow (toMinutes, number.divide (60))

export const toDays: {
  (duration: Duration): number
} = flow (toHours, number.divide (24))

export const toWeeks: {
  (duration: Duration): number
} = flow (toDays, number.divide (7))

export const toMonths: {
  (duration: Duration): number
} = flow (toDays, number.divide (30))

export const toYears: {
  (duration: Duration): number
} = flow (toMonths, number.divide (12))

export const fromDate: {
  (date: Date): Duration
} = date => ({ milliseconds: date.valueOf () })

export const toDate: {
  (duration: Duration): Date
} = flow (toMilliseconds, milliseconds => new Date (milliseconds))

export const add: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow (toMilliseconds, number.add (toMilliseconds (durationY)), fromMilliseconds)

export const subtract: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow (
    toMilliseconds,
    number.subtract (toMilliseconds (durationY)),
    fromMilliseconds,
  )

export const multiply: {
  (times: number): (durationX: Duration) => Duration
} = times => flow (toMilliseconds, number.multiply (times), fromMilliseconds)

export const divide: {
  (times: number): (durationX: Duration) => Duration
} = times => flow (toMilliseconds, number.divide (times), fromMilliseconds)

export const divideSafe: {
  (times: number): (durationX: Duration) => option.Option<Duration>
} = times =>
  flow (toMilliseconds, number.divideSafe (times), option.map (fromMilliseconds))

export const equals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY => flow (toMilliseconds, number.equals (toMilliseconds (durationY)))

export const lessThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow (toMilliseconds, number.lessThan (toMilliseconds (durationY)))

export const lessThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow (toMilliseconds, number.lessThanOrEquals (toMilliseconds (durationY)))

export const moreThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow (toMilliseconds, number.moreThan (toMilliseconds (durationY)))

export const moreThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow (toMilliseconds, number.moreThanOrEquals (toMilliseconds (durationY)))
