import * as Invariant_ from '../../typeclasses/Invariant'
import { State, Hkt } from './state'
import { flow } from '../../utils/flow'

export const Invariant: Invariant_.Invariant<Hkt> = {
  imap: (st, ts) => state => flow(ts, state, ([a, s]) => [a, st(s)]),
}

export const imap: {
  <S, T>(
    st: (s: S) => T,
    ts: (t: T) => S,
  ): <A>(state: State<S, A>) => State<T, A>
} = Invariant.imap
