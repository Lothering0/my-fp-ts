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
} = weeks => ({ days: weeks * 7 })

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
        string.match ({
          onEmpty: constFalse,
          onNonEmpty: trimmed => regExp.test (trimmed),
        }),
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
    boolean.match ({
      onFalse: () =>
        result.fail (
          new DurationTemplateParseError ("Invalid duration template"),
        ),
      onTrue: () =>
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
    }),
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

export const prettify: {
  (self: Duration): Duration
} = self =>
  pipe (
    identity.Do,
    identity.apS ("ms", toMilliseconds (self)),
    identity.mapTo ("milliseconds", ({ ms }) => ms % 1000),
    identity.mapTo ("seconds", ({ ms }) => Math.floor (toSeconds (ms)) % 60),
    identity.mapTo ("minutes", ({ ms }) => Math.floor (toMinutes (ms)) % 60),
    identity.mapTo ("hours", ({ ms }) => Math.floor (toHours (ms)) % 24),
    identity.mapTo ("days", ({ ms }) => Math.floor (toDays (ms)) % 30),
    identity.mapTo ("months", ({ ms }) => Math.floor (toMonths (ms)) % 12),
    identity.mapTo ("years", ({ ms }) => Math.floor (toYears (ms))),
    identity.map (
      ({ years, months, days, hours, minutes, seconds, milliseconds }) => ({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      }),
    ),
    readonlyRecord.filter (value => value !== 0),
  )

export const toTemplate: {
  (self: Duration): string
} = flow (
  prettify,
  readonlyRecord.toEntries,
  readonlyArray.filter (([unit]) =>
    pipe (durationUnits, readonlyArray.includes (unit)),
  ),
  readonlyArray.map (([unit, value]) =>
    value === 1 ? [pipe (unit, string.slice (0, -1)), value] : [unit, value],
  ),
  readonlyArray.map (([unit, value]) => `${value} ${unit}`),
  readonlyArray.join (" "),
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

const millisecondsFromMonths: {
  (months: number): number
} = months => millisecondsFromDays (months * 30)

const millisecondsFromYears: {
  (years: number): number
} = years => millisecondsFromMonths (years * 12)

export const toMilliseconds: {
  (input: DurationInput): number
} = input =>
  pipe (
    identity.Do,
    identity.apS ("duration", make (input)),
    identity.mapTo (
      "years",
      ({ duration }) => duration.years ?? duration.y ?? 0,
    ),
    identity.mapTo (
      "months",
      ({ duration }) => duration.months ?? duration.mn ?? 0,
    ),
    identity.mapTo ("days", ({ duration }) => duration.days ?? duration.d ?? 0),
    identity.mapTo (
      "hours",
      ({ duration }) => duration.hours ?? duration.h ?? 0,
    ),
    identity.mapTo (
      "minutes",
      ({ duration }) => duration.minutes ?? duration.m ?? 0,
    ),
    identity.mapTo (
      "seconds",
      ({ duration }) => duration.seconds ?? duration.s ?? 0,
    ),
    identity.mapTo (
      "milliseconds",
      ({ duration }) => duration.milliseconds ?? duration.ms ?? 0,
    ),
    identity.map (
      ({ milliseconds, seconds, minutes, hours, days, months, years }) =>
        milliseconds +
        millisecondsFromSeconds (seconds) +
        millisecondsFromMinutes (minutes) +
        millisecondsFromHours (hours) +
        millisecondsFromDays (days) +
        millisecondsFromMonths (months) +
        millisecondsFromYears (years),
    ),
  )

export const toSeconds: {
  (duration: DurationInput): number
} = flow (toMilliseconds, number.divide (1000))

export const toMinutes: {
  (duration: DurationInput): number
} = flow (toSeconds, number.divide (60))

export const toHours: {
  (duration: DurationInput): number
} = flow (toMinutes, number.divide (60))

export const toDays: {
  (duration: DurationInput): number
} = flow (toHours, number.divide (24))

export const toWeeks: {
  (duration: DurationInput): number
} = flow (toDays, number.divide (7))

export const toMonths: {
  (duration: DurationInput): number
} = flow (toDays, number.divide (30))

export const toYears: {
  (duration: DurationInput): number
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
