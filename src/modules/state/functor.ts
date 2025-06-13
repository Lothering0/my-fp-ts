import { flow } from "../../utils/flow"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { _URI, run, State } from "./state"

export const functor: Functor2<typeof _URI> = createFunctor2 ({
  _URI,
  map: <S, A, B>(fa: State<S, A>, f: (a: A) => B) =>
    flow (
      run<S>,
      g => g (fa),
      ([a1, s1]) => [f (a1), s1],
    ),
})

export const { map } = functor
