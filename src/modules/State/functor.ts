import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, State } from './state'
import { run } from './utils'
import { flow } from '../../utils/flow'

export const Functor = Functor_.create<Hkt>({
  map: ab => state =>
    flow(
      s => run(s)(state),
      ([a1, s1]) => [ab(a1), s1],
    ),
})

export const map: {
  <A, B>(ab: (a: A) => B): <S>(state: State<S, A>) => State<S, B>
} = Functor.map

export const as: {
  <A>(a: A): <S>(state: State<S, unknown>) => State<S, A>
} = Functor.as
