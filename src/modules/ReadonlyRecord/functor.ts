import * as functor from "../../types/Functor"
import * as functorWithIndex from "../../types/FunctorWithIndex"
import * as readonlyArray from "../ReadonlyArray"
import { flow } from "../../utils/flow"
import { ReadonlyRecord, ReadonlyRecordHkt } from "./readonly-record"
import { fromEntries, toEntries } from "./utils"

export const Functor: functor.Functor<ReadonlyRecordHkt> = {
  map: ab =>
    flow (
      toEntries,
      readonlyArray.map (([k, a]) => [k, ab (a)] as const),
      fromEntries,
    ),
}

export const FunctorWithIndex: functorWithIndex.FunctorWithIndex<
  ReadonlyRecordHkt,
  string
> = {
  ...Functor,
  mapWithIndex: kab =>
    flow (
      toEntries,
      readonlyArray.map (([k, a]) => [k, kab (k, a)] as const),
      fromEntries,
    ),
}

export const map: {
  <A, B>(
    ab: (a: A) => B,
  ): <K extends string>(self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
} = Functor.map as typeof map

export const mapWithIndex: {
  <A, B, K extends string>(
    kab: (k: K, a: A) => B,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
  <A, B>(
    kab: (k: string, a: A) => B,
  ): <K extends string>(self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
} = FunctorWithIndex.mapWithIndex as typeof mapWithIndex
