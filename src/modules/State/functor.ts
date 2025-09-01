import * as functor from "../../typeclasses/Functor"
import { StateHkt, State } from "./state"
import { run } from "./utils"
import { flow } from "../../utils/flow"

export const Functor: functor.Functor<StateHkt> = {
  map: ab => self =>
    flow (
      s => run (s) (self),
      ([a1, s1]) => [ab (a1), s1],
    ),
}

export const map: {
  <A, B>(ab: (a: A) => B): <S>(self: State<S, A>) => State<S, B>
} = Functor.map
