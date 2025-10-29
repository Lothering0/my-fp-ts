import * as Invariant_ from '../../typeclasses/Invariant'
import { State, StateHkt } from './state'
import { flow } from '../../utils/flow'

export const Invariant: Invariant_.Invariant<StateHkt> = {
  imap: (st, ts) => self => flow(ts, self, ([a, s]) => [a, st(s)]),
}

export const imap: {
  <S, T>(
    st: (s: S) => T,
    ts: (t: T) => S,
  ): <A>(self: State<S, A>) => State<T, A>
} = Invariant.imap
