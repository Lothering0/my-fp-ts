import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import * as Array from '../ReadonlyArray'
import { flow } from '../../utils/flow'
import { ReadonlyRecord, ReadonlyRecordHkt } from './readonly-record'
import { fromEntries, toEntries } from './utils'

export const Functor: Functor_.Functor<ReadonlyRecordHkt> = {
  map: ab =>
    flow(
      toEntries,
      Array.map(([k, a]) => [k, ab(a)] as const),
      fromEntries,
    ),
}

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  ReadonlyRecordHkt,
  string
> = {
  ...Functor,
  mapWithIndex: akb =>
    flow(
      toEntries,
      Array.map(([k, a]) => [k, akb(a, k)] as const),
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
