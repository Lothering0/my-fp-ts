import * as functor from "../../typeclasses/Functor"
import { OptionHkt, Option, some } from "./option"
import { flow } from "../../utils/flow"
import { match } from "./matchers"
import { zero } from "./alternative"

export const Functor: functor.Functor<OptionHkt> = {
  map: fab =>
    match ({
      onNone: zero,
      onSome: flow (fab, some),
    }),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Option<A>) => Option<B>
} = Functor.map
