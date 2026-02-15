import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import * as Array from '../ReadonlyArray'
import { flow } from '../../utils/flow'
import { ReadonlyRecord, Hkt } from './readonly-record'
import { fromEntries, toEntries } from './utils'

export const Functor = Functor_.create<Hkt>({
  map: ab =>
    flow(
      toEntries,
      Array.map(([k, a]) => [k, ab(a)] as const),
      fromEntries,
    ),
})

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<Hkt, string> =
  {
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
  ): (record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
  <A, B>(
    akb: (a: A, k: string) => B,
  ): <K extends string>(record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
} = FunctorWithIndex.mapWithIndex as typeof map

export const as: {
  <A>(
    a: A,
  ): <K extends string>(
    record: ReadonlyRecord<K, unknown>,
  ) => ReadonlyRecord<K, A>
} = FunctorWithIndex.as
