import { Eq } from "../../types/Eq"
import { Identity, identity } from "./identity"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Identity<A>>
} = identity
