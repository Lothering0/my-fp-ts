import * as F from "../../types/Functor"
import { StateHKT, State } from "./state"
import { run } from "./utils"
import { flow } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<StateHKT> = {
  map: overload (
    1,
    <S, A, B>(self: State<S, A>, ab: (a: A) => B): State<S, B> =>
      flow (
        (s: S) => run (s) (self),
        ([a1, s1]) => [ab (a1), s1],
      ),
  ),
}

export const map: {
  <S, A, B>(ab: (a: A) => B): (self: State<S, A>) => State<S, B>
  <S, A, B>(self: State<S, A>, ab: (a: A) => B): State<S, B>
} = Functor.map
