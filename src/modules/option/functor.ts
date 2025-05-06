import { createFunctor, Functor } from "../../types/Functor"
import { some, option, none } from "./option"
import { compose } from "../identity"

export const functor: Functor<"Option"> = createFunctor ({
  _URI: "Option",
  of: some,
  map: (fa, f) => option (fa, () => none, compose (some, f)),
})

export const { of, map } = functor
