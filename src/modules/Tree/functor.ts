import * as A from "../Array"
import { URI } from "./tree"
import { make, valueOf, forestOf } from "./utils"
import { Functor, createFunctor } from "../../types/Functor"
import { pipe } from "../../utils/flow"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) => make (pipe (fa, valueOf, f), A.map (forestOf (fa), map (f))),
})

export const { map } = functor
