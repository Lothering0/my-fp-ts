import { identity } from "../Identity"
import { _ } from "../../utils/underscore"
import { constant } from "../../utils/constant"
import { pipe } from "../../utils/flow"
import { State } from "./state"

type Gets = <S, A>(f: (s: S) => A) => State<S, A>
export const gets: Gets = f => s => [f (s), s]

type Get = <S>() => State<S, S>
export const get: Get = () => gets (identity)

type Modify = <S>(f: (s: S) => S) => State<S, void>
export const modify: Modify = f => s => [_, f (s)]

type Put = <S>(s: S) => State<S, void>
export const put: Put = <S>(s: S) => pipe (s, constant, modify<S>)

type Run = <S>(s: S) => <A>(ma: State<S, A>) => [A, S]
export const run: Run = s => ma => ma (s)

type Evaluate = <S>(s: S) => <A>(ma: State<S, A>) => A
export const evaluate: Evaluate = s => ma => run (s) (ma)[0]

type Execute = <S>(s: S) => <A>(ma: State<S, A>) => S
export const execute: Execute = s => ma => run (s) (ma)[1]
