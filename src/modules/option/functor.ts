import { createFunctor, Functor } from "../../types/Functor"
import { some, option, none } from "./option"
import { compose } from "../identity"

export const functor: Functor<"Option"> = createFunctor ({
  _URI: "Option",
  map: (fa, f) => option (fa, () => none, compose (some, f)),
})

export const { map } = functor
