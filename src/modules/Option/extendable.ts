import { createExtendable } from "../../types/Extendable"
import { Option, OptionHKT } from "./option"
import { Functor, map } from "./functor"

export const Extendable = createExtendable<OptionHKT> ({
  ...Functor,
  extend: fab => self => map (() => fab (self)) (self),
})

export const extend: {
  <A, B>(fab: (fa: Option<A>) => B): (self: Option<A>) => Option<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: Option<A>): Option<Option<A>>
} = Extendable.duplicate
