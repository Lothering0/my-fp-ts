import * as functor from "../../types/Functor"
import { OptionHKT, Option, some } from "./option"
import { flow } from "../../utils/flow"
import { match } from "./utils"
import { zero } from "./alternative"

export const Functor: functor.Functor<OptionHKT> = {
  map: fab => flow (match (zero, flow (fab, some))),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Option<A>) => Option<B>
} = Functor.map
