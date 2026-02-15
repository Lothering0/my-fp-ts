import { identity } from '../Identity'
import { _ } from '../../utils/underscore'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'
import { State } from './state'

export const gets: {
  <S, A>(sa: (s: S) => A): State<S, A>
} = sa => s => [sa(s), s]

export const get: {
  <S>(): State<S, S>
} = () => gets(identity)

export const modify: {
  <S>(ss: (s: S) => S): State<S, void>
} = ss => s => [_, ss(s)]

export const put: {
  <S>(s: S): State<S, void>
} = s => pipe(s, constant, modify)

export const run: {
  <S>(s: S): <A>(state: State<S, A>) => readonly [A, S]
} = s => state => state(s)

export const evaluate: {
  <S>(s: S): <A>(state: State<S, A>) => A
} = s => state => run(s)(state)[0]

export const execute: {
  <S>(s: S): <A>(state: State<S, A>) => S
} = s => state => run(s)(state)[1]
