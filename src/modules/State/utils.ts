import { identity } from "../Identity"
import { _ } from "../../utils/underscore"
import { constant } from "../../utils/constant"
import { pipe } from "../../utils/flow"
import { State } from "./state"

export const gets: {
  <S, A>(f: (s: S) => A): State<S, A>
} = f => s => [f (s), s]

export const get: {
  <S>(): State<S, S>
} = () => gets (identity)

export const modify: {
  <S>(f: (s: S) => S): State<S, void>
} = f => s => [_, f (s)]

export const put: {
  <S>(s: S): State<S, void>
} = <S>(s: S) => pipe (s, constant, modify<S>)

export const run: {
  <S>(s: S): <A>(ma: State<S, A>) => [A, S]
} = s => ma => ma (s)

export const evaluate: {
  <S>(s: S): <A>(ma: State<S, A>) => A
} = s => ma => run (s) (ma)[0]

export const execute: {
  <S>(s: S): <A>(ma: State<S, A>) => S
} = s => ma => run (s) (ma)[1]
