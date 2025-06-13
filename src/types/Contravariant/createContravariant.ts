import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { Contravariant, Contravariant2 } from "./Contravariant"
import { Contramap2Pointed, ContramapPointed } from "./Contramap"

type CreateContravariant = <URI extends URIS>(
  functor: CreateContravariantArg<URI>,
) => Contravariant<URI>
export const createContravariant: CreateContravariant = contravariant => ({
  ...contravariant,
  contramap: overload (contravariant.contramap),
})

type CreateContravariant2 = <URI extends URIS2>(
  functor: CreateContravariantArg2<URI>,
) => Contravariant2<URI>
export const createContravariant2: CreateContravariant2 =
  createContravariant as CreateContravariant2

interface CreateContravariantArg<URI extends URIS>
  extends Omit<Contravariant<URI>, "contramap"> {
  readonly contramap: ContramapPointed<URI>
}

interface CreateContravariantArg2<URI extends URIS2>
  extends Omit<Contravariant2<URI>, "contramap"> {
  readonly contramap: Contramap2Pointed<URI>
}
