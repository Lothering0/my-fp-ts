import * as option from "../Option"
import * as result from "../Result"
import * as separated from "../Separated"
import * as readonlyArray from "../ReadonlyArray"
import * as compactable from "../../typeclasses/Compactable"
import { reduce } from "./foldable"
import { flow, pipe } from "../../utils/flow"
import { ReadonlyRecord, ReadonlyRecordHkt } from "./readonly-record"
import { append, fromEntries, toEntries } from "./utils"

const getInitialSeparated: {
  <E, A>(): separated.Separated<
    ReadonlyRecord<string, E>,
    ReadonlyRecord<string, A>
  >
} = () => separated.make ({}, {})

export const Compactable: compactable.Compactable<ReadonlyRecordHkt> = {
  compact: flow (
    toEntries,
    readonlyArray.filterMap (([k, ma]) =>
      pipe (
        ma,
        option.match (option.zero, a => option.some ([k, a] as const)),
      ),
    ),
    fromEntries,
  ),
  compactResults: flow (
    toEntries,
    readonlyArray.filterMap (([k, ma]) =>
      pipe (
        ma,
        result.match (option.zero, a => option.some ([k, a] as const)),
      ),
    ),
    fromEntries,
  ),
  separate: reduce (getInitialSeparated (), (b, ma, k) =>
    pipe (
      ma,
      result.match (
        e =>
          separated.make (
            pipe (b, separated.left, append (k, e)),
            separated.right (b),
          ),
        a =>
          separated.make (
            separated.left (b),
            pipe (b, separated.right, append (k, a)),
          ),
      ),
    ),
  ),
}

export const compact: {
  <A, K extends string>(
    self: ReadonlyRecord<K, option.Option<A>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compact as typeof compact

export const compactResults: {
  <A, K extends string>(
    self: ReadonlyRecord<K, result.Result<unknown, A>>,
  ): ReadonlyRecord<K, A>
} = Compactable.compactResults as typeof compactResults

export const separate: {
  <E, A, K extends string>(
    self: ReadonlyRecord<K, result.Result<E, A>>,
  ): separated.Separated<ReadonlyRecord<K, E>, ReadonlyRecord<K, A>>
} = Compactable.separate as typeof separate
