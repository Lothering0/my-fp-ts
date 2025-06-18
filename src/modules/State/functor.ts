import { flow } from "../../utils/flow"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { URI, run, State } from "./state"

export const functor: Functor2<URI> = createFunctor2 ({
  URI,
  map: <S, A, B>(fa: State<S, A>, f: (a: A) => B) =>
    flow (
      (s: S) => run (s) (fa),
      ([a1, s1]) => [f (a1), s1],
    ),
})

export const { map } = functor
