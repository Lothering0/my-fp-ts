import * as array from '../ReadonlyArray'
import * as record from '../ReadonlyRecord'
import * as option from '../Option'
import * as result from '../Result'
import * as number from '../Number'
import * as string from '../String'
import * as boolean from '../Boolean'
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

const arrayOption = option.transform(array.Monad)

export const isTemplateValid: {
  (template: string): boolean
} = template =>
  pipe(
    durationUnitsFull,
    array.reduce('', (acc, unit, i) => {
      const shortUnit = durationUnitsShort[i]
      const part = `(\\d+ (${unit}|${shortUnit}))|(1 ${unit}?)`
      return acc ? `(${part})? ?(${acc})?` : part
    }),
    string.prepend('^'),
    string.append('$'),
    pattern => new RegExp(pattern),
    regExp =>
      pipe(
        template,
        string.trim,
        string.match({
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
  (template: string): result.Result<DurationTemplateParseError, Duration>
} = template =>
  pipe(
    template,
    isTemplateValid,
    boolean.match({
      onFalse: () =>
        result.fail(
          new DurationTemplateParseError('Invalid duration template'),
        ),
      onTrue: () =>
        pipe(
          template.matchAll(/(-?\d+) +(\w+)/g),
          Array.from<ReadonlyArray<string>>,
          array.map(array.tail),
          arrayOption.map(([value, unit]) => [unit!, Number(value)] as const),
          array.compact,
          array.filter(([key]) => pipe(durationUnits, array.includes(key))),
          record.fromEntries,
          result.succeed,
        ),
    }),
  )

export const fromTemplateOrZero: {
  (template: string): Duration
} = flow(fromTemplate, result.getOrElse(constant(empty)))

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
    record.filter(value => value !== 0),
  )
}

export const toTemplate: {
  (self: Duration): string
} = flow(
  prettify,
  record.toEntries,
  array.filter(([unit]) => pipe(durationUnits, array.includes(unit))),
  array.map(([unit, value]) =>
    value === 1 ? [pipe(unit, string.slice(0, -1)), value] : [unit, value],
  ),
  array.map(([unit, value]) => `${value} ${unit}`),
  array.join(' '),
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
} = flow(toMilliseconds, number.divide(1000))

export const toMinutes: {
  (duration: DurationInput): number
} = flow(toSeconds, number.divide(60))

export const toHours: {
  (duration: DurationInput): number
} = flow(toMinutes, number.divide(60))

export const toDays: {
  (duration: DurationInput): number
} = flow(toHours, number.divide(24))

export const toWeeks: {
  (duration: DurationInput): number
} = flow(toDays, number.divide(7))

export const toMonths: {
  (duration: DurationInput): number
} = flow(toDays, number.divide(30))

export const toYears: {
  (duration: DurationInput): number
} = flow(toMonths, number.divide(12))

export const fromDate: {
  (date: Date): Duration
} = date => ({ milliseconds: date.valueOf() })

export const toDate: {
  (duration: Duration): Date
} = flow(toMilliseconds, milliseconds => new Date(milliseconds))

export const add: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow(toMilliseconds, number.add(toMilliseconds(durationY)), fromMilliseconds)

export const subtract: {
  (durationY: Duration): (durationX: Duration) => Duration
} = durationY =>
  flow(
    toMilliseconds,
    number.subtract(toMilliseconds(durationY)),
    fromMilliseconds,
  )

export const multiply: {
  (times: number): (durationX: Duration) => Duration
} = times => flow(toMilliseconds, number.multiply(times), fromMilliseconds)

export const divide: {
  (times: number): (durationX: Duration) => Duration
} = times => flow(toMilliseconds, number.divide(times), fromMilliseconds)

export const divideSafe: {
  (times: number): (durationX: Duration) => option.Option<Duration>
} = times =>
  flow(toMilliseconds, number.divideSafe(times), option.map(fromMilliseconds))

export const equals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY => flow(toMilliseconds, number.equals(toMilliseconds(durationY)))

export const lessThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, number.lessThan(toMilliseconds(durationY)))

export const lessThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, number.lessThanOrEquals(toMilliseconds(durationY)))

export const moreThan: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, number.moreThan(toMilliseconds(durationY)))

export const moreThanOrEquals: {
  (durationY: Duration): (durationX: Duration) => boolean
} = durationY =>
  flow(toMilliseconds, number.moreThanOrEquals(toMilliseconds(durationY)))
