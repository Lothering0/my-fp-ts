import { createFunctor, Functor } from "../../types/Functor"
import { URI, some } from "./option"
import { pipe, flow } from "../../utils/flow"
import { match, zero } from "./utils"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) => pipe (fa, match (zero, flow (f, some))),
})

export const { map } = functor
