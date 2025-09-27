import * as Array from '../ReadonlyArray'
import * as Record from '../ReadonlyRecord'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Number from '../Number'
import * as String from '../String'
import * as Boolean from '../Boolean'
import { flow, pipe } from '../../utils/flow'
import { isNumber, isObject, isString } from '../../utils/typeChecks'
import {
  Duration,
  durationUnits,
  DurationInput,
  durationUnitsFull,
  durationUnitsShort,
} from './duration'
import { constant, constFalse } from '../../utils/constant'
import { empty } from './monoid'

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

const arrayOption = Option.transform(Array.Monad)

export const isTemplateValid: {
  (template: string): boolean
} = template =>
  pipe(
    durationUnitsFull,
    Array.reduce('', (acc, unit, i) => {
      const shortUnit = durationUnitsShort[i]
      const part = `(\\d+ (${unit}|${shortUnit}))|(1 ${unit}?)`
      return acc ? `(${part})? ?(${acc})?` : part
    }),
    String.prepend('^'),
    String.append('$'),
    pattern => new RegExp(pattern),
    regExp =>
      pipe(
        template,
        String.trim,
        String.match({
          onEmpty: constFalse,
          onNonEmpty: trimmed => regExp.test(trimmed),
        }),
      ),
  )

export class DurationTemplateParseError extends SyntaxError {
  constructor(message: string) {
    super(message)
    this.name = 'DurationTemplateParseError'
  }
}

export const fromTemplate: {
  (template: string): Result.Result<DurationTemplateParseError, Duration>
} = template =>
  pipe(
    template,
    isTemplateValid,
    Boolean.match({
      onFalse: () =>
        Result.fail(
          new DurationTemplateParseError('Invalid duration template'),
        ),
      onTrue: () =>
        pipe(
          template.matchAll(/(-?\d+) +(\w+)/g),
          Array.Array.from<ReadonlyArray<string>>,
          Array.map(Array.tail),
          arrayOption.map(
            ([value, unit]) => [unit!, Number.Number(value)] as const,
          ),
          Array.compact,
          Array.filter(([key]) => pipe(durationUnits, Array.includes(key))),
          Record.fromEntries,
          Result.succeed,
        ),
    }),
  )

export const fromTemplateOrZero: {
  (template: string): Duration
} = flow(fromTemplate, Result.getOrElse(constant(empty)))

export const make: {
  (input: DurationInput): Duration
} = input => {
  if (isObject(input)) {
    return input
  }
  if (isString(input)) {
    return fromTemplateOrZero(input)
  }
  if (isNumber(input)) {
    return fromMilliseconds(input)
  }
  return empty
}

export const prettify: {
  (self: Duration): Duration
} = self => {
  const ms = toMilliseconds(self)
  const out = {
    years: Math.floor(toYears(ms)),
    months: Math.floor(toMonths(ms)) % 12,
    days: Math.floor(toDays(ms)) % 30,
    hours: Math.floor(toHours(ms)) % 24,
    minutes: Math.floor(toMinutes(ms)) % 60,
    seconds: Math.floor(toSeconds(ms)) % 60,
    milliseconds: ms % 1000,
  }
  return pipe(
    out,
    Record.filter(value => value !== 0),
  )
}

export const toTemplate: {
  (self: Duration): string
} = flow(
  prettify,
  Record.toEntries,
  Array.filter(([unit]) => pipe(durationUnits, Array.includes(unit))),
  Array.map(([unit, value]) =>
    value === 1 ? [pipe(unit, String.slice(0, -1)), value] : [unit, value],
  ),
  Array.map(([unit, value]) => `${value} ${unit}`),
  Array.join(' '),
)

const millisecondsFromSeconds: {
  (seconds: number): number
} = seconds => seconds * 1000

const millisecondsFromMinutes: {
  (minutes: number): number
} = minutes => millisecondsFromSeconds(minutes * 60)

const millisecondsFromHours: {
  (hours: number): number
} = hours => millisecondsFromMinutes(hours * 60)

const millisecondsFromDays: {
  (days: number): number
} = days => millisecondsFromHours(days * 24)

const millisecondsFromMonths: {
  (months: number): number
} = months => millisecondsFromDays(months * 30)

const millisecondsFromYears: {
  (years: number): number
} = years => millisecondsFromMonths(years * 12)

export const toMilliseconds: {
  (input: DurationInput): number
} = input => {
  const duration = make(input)
  const years = duration.years ?? duration.y ?? 0
  const months = duration.months ?? duration.mn ?? 0
  const days = duration.days ?? duration.d ?? 0
  const hours = duration.hours ?? duration.h ?? 0
  const minutes = duration.minutes ?? duration.m ?? 0
  const seconds = duration.seconds ?? duration.s ?? 0
  const milliseconds = duration.milliseconds ?? duration.ms ?? 0

  return (
    milliseconds +
    millisecondsFromSeconds(seconds) +
    millisecondsFromMinutes(minutes) +
    millisecondsFromHours(hours) +
    millisecondsFromDays(days) +
    millisecondsFromMonths(months) +
    millisecondsFromYears(years)
  )
}

export const toSeconds: {
  (duration: DurationInput): number
} = flow(toMilliseconds, Number.divide(1000))

export const toMinutes: {
  (duration: DurationInput): number
} = flow(toSeconds, Number.divide(60))

export const toHours: {
  (duration: DurationInput): number
} = flow(toMinutes, Number.divide(60))

export const toDays: {
  (duration: DurationInput): number
} = flow(toHours, Number.divide(24))

export const toWeeks: {
  (duration: DurationInput): number
} = flow(toDays, Number.divide(7))

export const toMonths: {
  (duration: DurationInput): number
} = flow(toDays, Number.divide(30))

export const toYears: {
  (duration: DurationInput): number
} = flow(toMonths, Number.divide(12))

export const fromDate: {
  (date: Date): Duration
} = date => ({ milliseconds: date.valueOf() })

export const toDate: {
  (duration: Duration): Date
} = flow(toMilliseconds, milliseconds => new Date(milliseconds))

export const add: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow(toMilliseconds, Number.add(toMilliseconds(durationY)), fromMilliseconds)

export const subtract: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow(
    toMilliseconds,
    Number.subtract(toMilliseconds(durationY)),
    fromMilliseconds,
  )

export const multiply: {
  (times: number): (durationX: Duration) => Duration
} = times => flow(toMilliseconds, Number.multiply(times), fromMilliseconds)

export const divide: {
  (times: number): (durationX: Duration) => Duration
} = times => flow(toMilliseconds, Number.divide(times), fromMilliseconds)

export const divideSafe: {
  (times: number): (durationX: Duration) => Option.Option<Duration>
} = times =>
  flow(toMilliseconds, Number.divideSafe(times), Option.map(fromMilliseconds))

export const equals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY => flow(toMilliseconds, Number.equals(toMilliseconds(durationY)))

export const lessThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, Number.lessThan(toMilliseconds(durationY)))

export const lessThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, Number.lessThanOrEquals(toMilliseconds(durationY)))

export const moreThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, Number.moreThan(toMilliseconds(durationY)))

export const moreThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, Number.moreThanOrEquals(toMilliseconds(durationY)))
