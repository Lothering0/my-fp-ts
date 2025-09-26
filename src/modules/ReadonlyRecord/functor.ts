import * as functor from '../../typeclasses/Functor'
import * as functorWithIndex from '../../typeclasses/FunctorWithIndex'
import * as array from '../ReadonlyArray'
import { flow } from '../../utils/flow'
import { ReadonlyRecord, ReadonlyRecordHkt } from './readonly-record'
import { fromEntries, toEntries } from './utils'

export const Functor: functor.Functor<ReadonlyRecordHkt> = {
  map: ab =>
    flow(
      toEntries,
      array.map(([k, a]) => [k, ab(a)] as const),
      fromEntries,
    ),
}

export const FunctorWithIndex: functorWithIndex.FunctorWithIndex<
  ReadonlyRecordHkt,
  string
> = {
  ...Functor,
  mapWithIndex: akb =>
    flow(
      toEntries,
      array.map(([k, a]) => [k, akb(a, k)] as const),
      fromEntries,
    ),
}

export const map: {
  <A, B, K extends string>(
    akb: (a: A, k: K) => B,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
  <A, B>(
    akb: (a: A, k: string) => B,
  ): <K extends string>(self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
} = FunctorWithIndex.mapWithIndex as typeof map
