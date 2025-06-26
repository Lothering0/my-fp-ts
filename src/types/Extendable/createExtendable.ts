import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { Extendable, Extendable2 } from "./Extendable"
import { Extend2Pointed, ExtendPointed } from "./Extend"
import { Functor, Functor2 } from "../Functor"

type CreateExtendable = <URI extends URIS>(
  extendable: CreateExtendableArg<URI>,
) => Extendable<URI>
export const createExtendable: CreateExtendable = <URI extends URIS>(
  extendable: CreateExtendableArg<URI>,
) => ({
  ...extendable,
  extend: overload (1, extendable.extend),
})

type CreateExtendable2 = <URI extends URIS2>(
  extendable: CreateExtendable2Arg<URI>,
) => Extendable2<URI>
export const createExtendable2: CreateExtendable2 =
  createExtendable as CreateExtendable2

interface CreateExtendableArg<URI extends URIS> extends Functor<URI> {
  readonly extend: ExtendPointed<URI>
}

interface CreateExtendable2Arg<URI extends URIS2> extends Functor2<URI> {
  readonly extend: Extend2Pointed<URI>
}
