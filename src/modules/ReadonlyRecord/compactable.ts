import * as Option from '../Option'
import * as Result from '../Result'
import * as Array from '../ReadonlyArray'
import { create } from '../../typeclasses/Compactable'
import { flow, pipe } from '../../utils/flow'
import { ReadonlyRecord, ReadonlyRecordHkt } from './readonly-record'
import { fromEntries, toEntries } from './utils'
import { Functor } from './functor'

export const Compactable = create<ReadonlyRecordHkt>(Functor, {
  compact: flow(
    toEntries,
    Array.filterMap(([k, ma]) =>
      pipe(
        ma,
        Option.match({
          onNone: Option.none,
          onSome: a => Option.some([k, a] as const),
        }),
      ),
    ),
    fromEntries,
  ),
})

export const compact: {
  <A, K extends string>(
    self: ReadonlyRecord<K, Option.Option<A>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compact

export const compactResults: {
  <A, K extends string>(
    self: ReadonlyRecord<K, Result.Result<A, unknown>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compactResults

export const separate: {
  <A, E, K extends string>(
    self: ReadonlyRecord<K, Result.Result<A, E>>,
  ): readonly [ReadonlyRecord<K, A>, ReadonlyRecord<K, E>]
} = Compactable.separate
