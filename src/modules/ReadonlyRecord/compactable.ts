import * as option from "../Option"
import * as result from "../Result"
import * as readonlyArray from "../ReadonlyArray"
import { create } from "../../typeclasses/Compactable"
import { flow, pipe } from "../../utils/flow"
import { ReadonlyRecord, ReadonlyRecordHkt } from "./readonly-record"
import { fromEntries, toEntries } from "./utils"
import { Functor } from "./functor"

export const Compactable = create<ReadonlyRecordHkt> (Functor, {
  compact: flow (
    toEntries,
    readonlyArray.filterMap (([k, ma]) =>
      pipe (
        ma,
        option.match ({
          onNone: option.zero,
          onSome: a => option.some ([k, a] as const),
        }),
      ),
    ),
    fromEntries,
  ),
})

export const compact: {
  <A, K extends string>(
    self: ReadonlyRecord<K, option.Option<A>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compact

export const compactResults: {
  <A, K extends string>(
    self: ReadonlyRecord<K, result.Result<unknown, A>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compactResults

export const separate: {
  <E, A, K extends string>(
    self: ReadonlyRecord<K, result.Result<E, A>>,
  ): readonly [ReadonlyRecord<K, E>, ReadonlyRecord<K, A>]
} = Compactable.separate
