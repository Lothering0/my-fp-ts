import { URIS } from "../Kind"
import { overload } from "../../utils/overloads"
import { Contravariant } from "./Contravariant"
import { ContramapPointed } from "./Contramap"

type CreateContravariant = <URI extends URIS>(
  functor: CreateContravariantArg<URI>,
) => Contravariant<URI>
export const createContravariant: CreateContravariant = contravariant => ({
  ...contravariant,
  contramap: overload (contravariant.contramap),
})

interface CreateContravariantArg<URI extends URIS>
  extends Omit<Contravariant<URI>, "contramap"> {
  readonly contramap: ContramapPointed<URI>
}
