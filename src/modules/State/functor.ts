import * as F from "../../types/Functor"
import { StateHKT, State } from "./state"
import { run } from "./utils"
import { flow } from "../../utils/flow"

export const Functor: F.Functor<StateHKT> = {
  map: ab => self =>
    flow (
      s => run (s) (self),
      ([a1, s1]) => [ab (a1), s1],
    ),
}

export const map: {
  <A, B>(ab: (a: A) => B): <S>(self: State<S, A>) => State<S, B>
} = Functor.map
